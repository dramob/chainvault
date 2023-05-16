import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import styles from '../styles/DocApp.module.css';
import nftContractAbi from '../back/NFTMinter';


const DocApp = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ipfsHash, setIpfsHash] = useState('');
  const [previewImage, setPreviewImage] = useState('');
    
  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: formData,
          headers: {
            pinata_api_key: '83e03c776352ab207242',
            pinata_secret_api_key: '8fa6c34b657413959e239faa9309679cb57cd06e39343651679fa54f020127a4',
            'Content-Type': 'multipart/form-data',
          },
        });

        const cid = response.data.IpfsHash;
        console.log('CID:', cid);
        setIpfsHash(cid);
      } catch (error) {
        alert('Error sending File to IPFS');
        console.log(error);
      }
        
        // Mint the NFT
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        const signer = provider.getSigner();
        const nftContractAddress = '0xcf2DFf7D3c62B17D03891FaF9f70889315617319'; // Replace with your NFT contract address
        const nftContract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);

        try {
          const account = await signer.getAddress(); // Get current user's account
          const transaction = await nftContract.safeMint(account); // Mint NFT to the current user's account
          await transaction.wait();

          console.log('NFT minted successfully!');
        } catch (error) {
          console.error('Error minting NFT:', error);
        }
      
    }
  };
  return (
    <div className={styles.docAppContainer}>
      <h1>Stockage </h1>
      <input type="file" multiple onChange={handleFileSelection} className={styles.fileInput} />
      {previewImage && (
        <img
          src={previewImage}
          alt="Aperçu du document"
          className={styles.previewImage}
        />
      )}
      <button onClick={handleSubmit} className={styles.uploadButton}>Envoyer sur IPFS</button>
      {ipfsHash && <p className={styles.ipfsHash}>Empreintes IPFS des fichiers envoyés : {ipfsHash}</p>}
    </div>
  );
};

export default DocApp;