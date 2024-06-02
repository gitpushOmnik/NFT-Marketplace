/**
 * @fileOverview This component displays all unsold NFT items from the marketplace and allows users to purchase them.
 * Utilizes React, Ethers.js, and React-Bootstrap for displaying and buying NFTs.
 */

// Import necessary libraries and components
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Row, Col, Card, Button } from 'react-bootstrap';

/**
 * Home component for displaying and purchasing NFT items
 * @param {Object} props - The properties passed to the component
 * @param {Object} props.marketplace - The marketplace contract instance
 * @param {Object} props.nft - The NFT contract instance
 * @returns {JSX.Element} The Home component
 */
const Home = ({ marketplace, nft }) => {
  // State variables for loading status and NFT items
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  /**
   * Loads all unsold items from the marketplace
   * @returns {Promise<void>}
   */
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // Get URI URL from NFT contract
        const uri = await nft.tokenURI(item.tokenId);
        // Use URI to fetch the NFT metadata stored on IPFS
        const response = await fetch(uri);
        const metadata = await response.json();
        // Get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        });
      }
    }
    setLoading(false);
    setItems(items);
  };

  /**
   * Handles the purchase of an NFT item from the marketplace
   * @param {Object} item - The item to be purchased
   * @returns {Promise<void>}
   */
  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait();
    loadMarketplaceItems();
  };

  // UseEffect hook to load marketplace items on component mount
  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  // Render loading message if items are still loading
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  );

  // JSX to render the marketplace items or a message if no items are available
  return (
    <div className="flex justify-center">
      {items.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Card className="text-center shadow mb-2 bg-white rounded">
          <Card.Body>
            <Card.Title>There are no currently listed NFT Assets</Card.Title>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Home;
