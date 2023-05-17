import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import styles from '../styles/DocApp.module.css';
import nftContractAbi from '../back/NFTMinter';

const DocApp = () => {
  const [nftJson, setNftJson] = useState({
    description: "votre nft mint par nos soins",
    external_url: "",
    image: "",
    name: "document sensible",
    attributes: [
      {
        trait_type: "Colour",
        value: "Mixed",
      },
      {
        trait_type: "Coolness",
        value: "A lot!",
      },
      {
        trait_type: "Token Standard",
        value: "ERC721",
      },
    ],
  });
  const [metadataUrl, setMetadataUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ipfsHash, setIpfsHash] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [tokenId, setTokenId] = useState(''); // Nouveau state pour le token ID
    
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
        
        // Mise à jour de nftJson pour inclure le nouveau CID de l'image
        const updatedNftJson = {
          ...nftJson,
          image: `https://ipfs.io/ipfs/${cid}`,
        };
        setNftJson(updatedNftJson);

        // Envoi du JSON de NFT à IPFS
        const metadataFormData = new FormData();
        metadataFormData.append('file', new Blob([JSON.stringify(updatedNftJson)], { type: 'application/json' }));
  
        const metadataResponse = await axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: metadataFormData,
          headers: {
            pinata_api_key: '83e03c776352ab207242',
            pinata_secret_api_key: '8fa6c34b657413959e239faa9309679cb57cd06e39343651679fa54f020127a4',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const metadataCid = metadataResponse.data.IpfsHash;
        console.log('CID des métadonnées:', metadataCid);
        setMetadataUrl(`https://ipfs.io/ipfs/${metadataCid}`); // Mettre à jour l'URL des métadonnées avec le nouveau CID
  
        // Mint the NFT
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        const signer = provider.getSigner();
        const nftContractAddress = '0x296519f6c27664DD90C5d464471BCE3ec310b969'; // Remplacez par l'adresse de votre contrat NFT
        const nftContract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);
  
        try {
          const url = `https://ipfs.io/ipfs/${metadataCid}`;
          setMetadataUrl(url); // Mettre à jour l'URL des métadonnées
          const account = await signer.getAddress(); // Obtenir l'adresse du compte de l'utilisateur actuel
          const transaction = await nftContract.safeMint(account, metadataUrl); // Mint NFT pour le compte de l'utilisateur actuel en utilisant le nouveau CID
          await transaction.wait();
          
          // Récupérer le token ID du token minté
          const tokenID = await nftContract.tokenOfOwnerByIndex(account, 0);
          setTokenId(tokenID.toString());
          
          console.log('NFT minted successfully!');
          console.log(`Metadata URL: ${metadataUrl}`);
          console.log(`Token ID: ${tokenID.toString()}`);
        } catch (error) {
          console.error('Error minting NFT:', error);
        }
      } catch (error) {
        alert('Error sending File to IPFS');
        console.log(error);
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
      {metadataUrl && <p className={styles.metadataUrl}>URL des métadonnées : {metadataUrl}</p>}
      {tokenId && <p className={styles.tokenId}>Token ID du token minté : {tokenId}</p>}
    </div>
  );
};

export default DocApp;
