# NFT Marketplace

## Project Overview

The DApp NFT Marketplace is a decentralized application built on the Ethereum blockchain that enables users to create, buy, and sell non-fungible tokens (NFTs). NFTs are unique digital assets that can represent various forms of digital content, such as artwork, collectibles, music, videos, and more. The DApp provides a user-friendly platform for creators to mint and list their NFTs, while allowing buyers to discover and purchase these unique digital assets.

The application leverages the power of the Ethereum blockchain to ensure the authenticity, scarcity, and ownership of the NFTs. Each NFT is represented as a unique token on the blockchain, with its metadata (such as name, description, and image) stored on the decentralized Interplanetary File System (IPFS). This ensures that the NFT data is permanently stored and accessible, even if the original source is unavailable.

Users can easily connect their MetaMask wallets to the application, enabling them to securely manage their Ethereum transactions and NFT ownership. The application also utilizes Ethers.js, a powerful Ethereum library, to interact with the blockchain and execute smart contracts. Buyers can browse through the listed NFTs, view their details, and purchase the ones they desire. The application ensures a secure and transparent transaction process, with all NFT purchases recorded on the blockchain. Purchased NFTs are automatically transferred to the buyer's MetaMask wallet, allowing them to manage and showcase their digital assets.


## Features

- **NFT Creation**: Users can create and list new NFTs by uploading an image, setting a name, description, and price.
- **NFT Listing**: All listed NFTs are displayed on the marketplace for potential buyers.
- **NFT Purchase**: Users can purchase listed NFTs by paying with Ethereum.
- **NFT Management**: Users can view and manage their listed and purchased NFTs.
- **MetaMask Integration**: The application integrates with the popular MetaMask wallet, allowing users to manage their Ethereum transactions securely.

## Technologies Used

- **React**: The frontend framework used for building the user interface.
- **Ethers.js**: A library used for interacting with the Ethereum blockchain.
- **Web3**: A library used for handling wallet connections and transactions.
- **MetaMask**: A popular Ethereum wallet extension used for signing transactions and managing user accounts.
- **React-Bootstrap**: A library used for styling and UI components.
- **IPFS (Interplanetary File System)**: A decentralized file storage system used for storing NFT metadata.

## Usage

1. **Connect Wallet**: Connect your MetaMask wallet to the DApp by clicking the "Connect Wallet" button.
2. **Create NFT**:
   - Navigate to the "Create" page.
   - Upload an image for the NFT.
   - Enter the name, description, and listing price for the NFT.
   - Click the "Create & List NFT" button to mint the NFT and list it on the marketplace.
3. **Purchase NFT**:
   - On the home page, you can view all the listed NFTs.
   - Click the "Buy" button to purchase an NFT.
   - Confirm the transaction in your MetaMask wallet.
4. **View NFTs**:
   - Navigate to the "My Listed Items" page to view the NFTs you have listed for sale.
   - Navigate to the "My Purchases" page to view the NFTs you have purchased.

## Deployment and Testing

1. **Running Hardhat Tests**:

   > npx hardhat test

2. **Running Hardhat Node**:

   > npx hardhat node

3. **Deploying Contracts**

    > npx hardhat run src/backend/scripts/deploy.js --network localhost

4. **Running ReactJS Frontend server**

    > npm run start
   
## License

This project is licensed under the [MIT License](LICENSE).
