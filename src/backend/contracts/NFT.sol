// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title NFT
 * @dev This contract allows for the creation of non-fungible tokens (NFTs) with metadata storage capabilities.
 * Inherits from OpenZeppelin's ERC721URIStorage for additional functionality.
 */
contract NFT is ERC721URIStorage {
    // Variable to keep track of the total number of tokens minted
    uint public tokensCount;

    /**
     * @dev Initializes the contract by setting a name and a symbol for the token collection.
     */
    constructor() ERC721("Omnik NFT", "OMNIK") {}

    /**
     * @dev Mints a new NFT with a given URI.
     * @param _tokenURI The URI pointing to the token's metadata.
     * @return The ID of the newly minted token.
     *
     * Requirements:
     *
     * - Caller must be an externally owned account (EOA).
     */
    function mint(string memory _tokenURI) external returns (uint) {
        tokensCount++;

        // Mints new NFT for the caller of the function
        _safeMint(msg.sender, tokensCount);

        // Sets the metadata for the newly minted NFT
        _setTokenURI(tokensCount, _tokenURI);

        return tokensCount;
    }
}
