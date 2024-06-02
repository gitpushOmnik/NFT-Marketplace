/**
 * @fileOverview This component allows users to create and list NFTs on the marketplace by uploading an image to IPFS and entering the necessary details.
 * Utilizes React, Ethers.js, and IPFS for creating NFTs.
 */

// Import necessary libraries and components
import { useState } from 'react';
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { Row, Form, Button, Container, Card } from 'react-bootstrap';

// IPFS configuration
const projectId = "e494c2a6d5db46bb8b5c95aca98e49d5";
const projectSecret = "8N9igPKM59uTbcg3qfLTLZBhKZuJIG58dIbfxnZ0Sxk5D36Vu4RiBw";

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  // headers: {
  //   authorization: auth,
  // }
});

/**
 * Create component for creating and listing NFTs
 * @param {Object} props - The properties passed to the component
 * @param {Object} props.marketplace - The marketplace contract instance
 * @param {Object} props.nft - The NFT contract instance
 * @returns {JSX.Element} The Create component
 */
const Create = ({ marketplace, nft }) => {
  // State variables for image, price, name, and description of the NFT
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Handles image upload to IPFS
   * @param {Object} event - The event triggered on file input change
   * @returns {Promise<void>}
   */
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);
        console.log(result);
        // setImage(`https://infura-ipfs.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  /**
   * Handles NFT creation
   * @returns {Promise<void>}
   */
  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    try {
      const result = await client.add(JSON.stringify({ image, price, name, description }));
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };

  /**
   * Mints the NFT and lists it on the marketplace
   * @param {Object} result - The result object from IPFS
   * @returns {Promise<void>}
   */
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    // Mint NFT
    await (await nft.mint(uri)).wait();
    // Get tokenId of new NFT
    const id = await nft.tokenCount();
    // Approve marketplace to spend NFT
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // Add NFT to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  // JSX to render the form for creating and listing NFTs
  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">NFT Creation Form</h2>
              <Form>
                <Form.Group controlId="formFile" className="mb-3 d-flex align-items-center">
                  <div className="col-4 pe-3">
                    <Form.Label>Upload NFT Image</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control
                      type="file"
                      required
                      name="file"
                      onChange={uploadToIPFS}
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formName" className="mb-3 d-flex align-items-center">
                  <div className="col-4 pe-4 align-items-left">
                    <Form.Label className="align-items-left">Name of the NFT</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      placeholder="Enter NFT name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formDescription" className="mb-3 d-flex align-items-center">
                  <div className="col-4 pe-4">
                    <Form.Label>Details about the NFT</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter NFT description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formPrice" className="mb-4 d-flex align-items-center">
                  <div className="col-4 pe-3">
                    <Form.Label className="text-end">Price (ETH)</Form.Label>
                  </div>
                  <div className="col">
                    <Form.Control
                      type="number"
                      placeholder="Enter price in ETH"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>
                <div className="d-grid">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={createNFT}
                  >
                    Create & List NFT
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Create;
