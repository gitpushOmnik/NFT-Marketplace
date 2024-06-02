/**
 * @fileOverview This script deploys the NFTMarketplace contract and saves its address and ABI for frontend use.
 * Requires the `ethers` and `fs` modules.
 */

// Main function to deploy contracts
async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy the NFT contract
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();

  // Deploy the NFTMarketplace contract
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(1);
  
  console.log("NFT Contract Address:", nft.address);
  console.log("NFT Marketplace Contract Address:", nftMarketplace.address);

  // Save contract address and ABI for frontend
  saveFrontendFiles(nft, "NFT");
  saveFrontendFiles(nftMarketplace, "NFTMarketplace");

}

/**
 * @description Saves the deployed contract's address and ABI to the frontend directory.
 * @param {Object} contract - The deployed contract instance.
 * @param {string} name - The name of the contract.
 */
function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  // Create the contracts directory if it does not exist
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Write the contract address to a JSON file
  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  // Read the contract artifact (ABI) and write it to a JSON file
  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// Execute the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
