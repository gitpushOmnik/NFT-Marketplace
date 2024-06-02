// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @dev A marketplace for buying and selling ERC721 NFTs with a fee mechanism.
 * Inherits from OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks.
 */
contract NFTMarketplace is ReentrancyGuard {
    // Address of the account that receives fees from NFT purchases
    address payable public immutable feeAccount;
    
    // Percentage fee charged on each purchase
    uint public immutable feePercent;
    
    // Counter for the total number of items listed in the marketplace
    uint public itemCount;
    
    // Mapping of item ID to Item struct
    mapping(uint => Item) public items;

    // Structure to represent an item listed in the marketplace
    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // Event emitted when an item is listed for sale
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // Event emitted when an item is sold
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer     
    );

    /**
     * @dev Sets the fee account to the deployer and initializes the fee percentage.
     * @param _feePercent The percentage fee charged on each purchase.
     */
    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    /**
     * @dev Lists an NFT for sale in the marketplace.
     * @param _nft The address of the NFT contract.
     * @param _tokenId The ID of the NFT token.
     * @param _price The price at which the NFT is listed for sale.
     *
     * Requirements:
     *
     * - `_price` must be greater than zero.
     * - Caller must own the NFT token.
     */
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price should be greater than zero");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, payable(msg.sender), false);
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    /**
     * @dev Purchases an NFT listed in the marketplace.
     * @param _itemId The ID of the item to be purchased.
     *
     * Requirements:
     *
     * - `_itemId` must be a valid item ID.
     * - `msg.value` must be at least the total price (item price + fee).
     * - The item must not have been sold already.
     */
    function purchaseItem(uint _itemId) external payable nonReentrant {
        require(_itemId > 0 && _itemId <= itemCount, "Not a valid itemId");
        
        uint _totalPrice = getTotalPrice(_itemId);
        require(msg.value >= _totalPrice, "Not enough ether to purchase the NFT");

        Item storage item = items[_itemId];
        require(!item.sold, "Item has already been sold");

        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        item.sold = true;

        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        emit Bought(_itemId, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);
    }

    /**
     * @dev Calculates the total price of an item including the marketplace fee.
     * @param _itemId The ID of the item.
     * @return The total price including the fee.
     */
    function getTotalPrice(uint _itemId) public view returns(uint) {
       return (items[_itemId].price * (100 + feePercent) / 100);
    }
}
