/**
 * @fileOverview This script sets up a React application that interacts with an NFT Marketplace using Web3 and MetaMask.
 * Utilizes React Router for navigation and Ethers.js for interacting with Ethereum smart contracts.
 */

// Import necessary libraries and components
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js';
import Create from './Create.js';
import MyListedItems from './MyListedItems.js';
import MyPurchases from './MyPurchases.js';
import NFTMarketplaceAbi from '../contractsData/NFTMarketplace.json';
import NFTMarketplaceAddress from '../contractsData/NFTMarketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import { useState } from 'react';
import { ethers } from "ethers";
import { Spinner } from 'react-bootstrap';

import './App.css';

/**
 * Main application component
 * @returns {JSX.Element} The main component of the React application
 */
function App() {
  // State variables for loading, user account, NFT, and marketplace contracts
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  /**
   * Handles MetaMask login/connect
   * @returns {Promise<void>}
   */
  const web3Handler = async () => {
    // Request account access from MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    // Get provider from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    // Reload page on chain change
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    // Reconnect on account change
    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });

    // Load contracts
    loadContracts(signer);
  };

  /**
   * Loads NFT and Marketplace contracts
   * @param {Object} signer - The signer object from Ethers.js
   * @returns {Promise<void>}
   */
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(NFTMarketplaceAddress.address, NFTMarketplaceAbi.abi, signer);
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  };

  // JSX to render the application
  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0 text-muted'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
