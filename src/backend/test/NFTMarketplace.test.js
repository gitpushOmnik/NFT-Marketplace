const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFT Marketplace", async () => {
    
    let deployer, address1, address2, nft, nftMarketplace;
    let feePercent = 1;
    let URI = "Sample Token URI";

    beforeEach(async () => {

        [deployer, address1, address2] = await ethers.getSigners()

        const NFT = await ethers.getContractFactory("NFT");
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        
        nft = await NFT.deploy();
        nftMarketplace = await NFTMarketplace.deploy(feePercent);
    })

    describe("Deployment", () => {
        it("Should track name and symbol of the Deployed NFT", async () => {
            expect(await nft.name()).to.equal("Omnik NFT");
            expect(await nft.symbol()).to.equal("OMNIK");
        })

        it("Should track feeAccount and feePercent of the Deployed NFTMarketplace", async () => {
            expect(await nftMarketplace.feeAccount()).to.equal(deployer.address);
            expect(await nftMarketplace.feePercent()).to.equal(feePercent);
        })
    })

    describe("Minting NFTs", () => {
        it("Should track each minted NFTs", async () => {
            await nft.connect(address1).mint(URI);
            expect(await nft.tokensCount()).to.equal(1);
            expect(await nft.balanceOf(address1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(address2).mint(URI);
            expect(await nft.tokensCount()).to.equal(2);
            expect(await nft.balanceOf(address2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })

    describe("Creating marketplace items", () => {
        beforeEach(async () => {
            //Address 1 mints an NFT
            await nft.connect(address1).mint(URI);

            // Address 1 approves NFT Marketplace to spend the NFT
            await nft.connect(address1).setApprovalForAll(nftMarketplace.address, true);
        })

        it("Emit Offered Event, Tranfer NFT from seller to marketplace, Track Item Count with Mapping", async () => {
            await expect(nftMarketplace.connect(address1).makeItem(nft.address, 1, toWei(1)))
                    .to.emit(nftMarketplace, "Offered")
                    .withArgs(
                        1,
                        nft.address,
                        1,
                        toWei(1),
                        address1.address
                    );

            expect(await nft.ownerOf(1)).to.equal(nftMarketplace.address);

            expect(await nftMarketplace.itemCount()).to.equal(1);

            const item = await nftMarketplace.items(1);

            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        })
    
        it("Should fail if price is set to zero", async () => {
            await expect(nftMarketplace.connect(address1).makeItem(nft.address, 1, 0))
            .to.be.revertedWith("Price should be greater than zero")
        })
    })

    describe("Purchasing marketplace items", () => {
        let price = 2
        let totalPriceInWei
        beforeEach( async () => {
            await nft.connect(address1).mint(URI);
            await nft.connect(address1).setApprovalForAll(nftMarketplace.address, true);
            await nftMarketplace.connect(address1).makeItem(nft.address, 1, toWei(2));
            totalPriceInWei = await nftMarketplace.getTotalPrice(1)

        })

        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit Bought event", async () => {
            const sellerInitialAccountBalance = await address1.getBalance()
            const feeAccountInitialBalance = await deployer.getBalance()

            console.log(fromWei(sellerInitialAccountBalance))
            console.log(fromWei(feeAccountInitialBalance))

            await expect(nftMarketplace.connect(address2).purchaseItem(1, {value: totalPriceInWei}))
                    .to.emit(nftMarketplace, "Bought")
                    .withArgs(
                        1,
                        nft.address,
                        1,
                        toWei(price),
                        address1.address,
                        address2.address
                    )

            const sellerFinalAccountBalance = await address1.getBalance()
            const feeAccountFinalBalance = await deployer.getBalance()
            const fee = (feePercent/100) * price

            const priceDifference = fromWei(sellerFinalAccountBalance)-fromWei(sellerInitialAccountBalance)
            expect(priceDifference).to.equal(2)

            const feeDifference = fromWei(feeAccountFinalBalance)-fromWei(feeAccountInitialBalance)
            expect(feeDifference, fee)
            expect(await nft.ownerOf(1)).to.equal(address2.address)
            expect((await nftMarketplace.items(1)).sold).to.equal(true);

        })

        it("Should fail for invalid item id, purchasing sold items, ether buy value is less", async () => {

            await expect(
                nftMarketplace.connect(address2).purchaseItem(2, {value: totalPriceInWei})
            ).to.be.revertedWith("Not a valid itemId")

            await expect(
                nftMarketplace.connect(address2).purchaseItem(0, {value: totalPriceInWei})
            ).to.be.revertedWith("Not a valid itemId")

            await expect(
                nftMarketplace.connect(address2).purchaseItem(1, {value: 0})
            ).to.be.revertedWith("Not enough ether to purchase the NFT")

            await nftMarketplace.connect(address2).purchaseItem(1, { value: totalPriceInWei})
            await expect(
                nftMarketplace.connect(deployer).purchaseItem(1, {value: totalPriceInWei})
            ).to.be.revertedWith("Item has already been sold")
        })
    })
})