import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import styles from '../styles/DocApp.module.css';
import nftContractAbi from '../back/NFTMinter';

const DocApp = () => {
  const getPreviewImageByExtension = (cid) => {
    if (!cid) {
      return;  // ou retournez une URL d'image par défaut
    }
    
    // Extrayez l'extension du fichier de la fin de l'ID IPFS (cid)
    const extension = cid.split('.').pop();
  
    switch (extension) {
      case 'pdf':
        return '/pdf-preview.png';
      case 'mp3':
        return '/mp3-preview.png';
      default:
        // Si l'extension n'est ni PDF ni MP3, retournez l'URL IPFS
        return `https://ipfs.io/ipfs/${cid}`;
    }
  };
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
  const getPreviewImage = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return '/pdf-preview.png';
      case 'mp3':
        return '/mp3-preview.png';
      default:
        return null;
    }
  };
  
  
  const [metadataUrl, setMetadataUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ipfsHash, setIpfsHash] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [documentHistory, setDocumentHistory] = useState([]);

  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('documentHistory'));
    if (storedDocuments) {
      setDocumentHistory(storedDocuments);
    }
  }, []);

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
        const Url=`https://ipfs.io/ipfs/${cid}`;
        console.log('CID:', cid);
        setIpfsHash(cid);
       
      const previewImage = getPreviewImage(file.type); // Utilisez la fonction getPreviewImage que nous avons définie plus tôt pour obtenir l'image de prévisualisation correspondante

      const updatedNftJson = {
        ...nftJson,
        image: previewImage || `https://ipfs.io/ipfs/${cid}`, // Si previewImage est disponible, utilisez-le. Sinon, utilisez l'URL IPFS
      };
      setNftJson(updatedNftJson);   
       

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
        setMetadataUrl(`https://ipfs.io/ipfs/${metadataCid}`);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        const signer = provider.getSigner();
        const nftContractAddress = '0x296519f6c27664DD90C5d464471BCE3ec310b969';
        const nftContract = new ethers.Contract(nftContractAddress, nftContractAbi, signer);

        try {
          const url = `https://ipfs.io/ipfs/${metadataCid}`;
          setMetadataUrl(url);
          const account = await signer.getAddress();
          const transaction = await nftContract.safeMint(account, url);
          await transaction.wait();

          const tokenID = await nftContract.tokenOfOwnerByIndex(account, 0);
          setTokenId(tokenID.toString());

          console.log('NFT minted successfully!');
          console.log(`Metadata URL: ${metadataUrl}`);
          console.log(`Token ID: ${tokenID.toString()}`);

          const newDocument = {
            id: tokenID.toString(),
            image: updatedNftJson.image,
            metadataUrl: metadataUrl,
            cid:cid
          };
          const updatedDocumentHistory = [...documentHistory, newDocument];
          setDocumentHistory(updatedDocumentHistory);
          localStorage.setItem('documentHistory', JSON.stringify(updatedDocumentHistory));
        } catch (error) {
          console.error('Error minting NFT:', error);
        }
      } catch (error) {
        alert('Error sending File to IPFS');
        console.log(error);
      }
    }
  };

  const handleLogout = () => {
    setDocumentHistory([]);
    localStorage.removeItem('documentHistory');
    // Code pour la déconnexion
  };

  const handleReset = () => {
    setDocumentHistory([]);
    localStorage.removeItem('documentHistory');
  };

  const handleDownload = (event, cid) => {
    event.preventDefault();
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    window.location.href = url;
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
      <h2>Historique des documents envoyés :</h2>
      <ul className={styles.documentHistory}>
  {documentHistory.map((document) => (
    <li key={document.id}>
      <a href={document.metadataUrl} target="_blank" rel="noopener noreferrer">
        <img src={getPreviewImageByExtension(document.cid)} alt="Aperçu du document" className={styles.documentThumbnail} />
      </a>
      <button onClick={(event) => handleDownload(event, document.cid)}>Télécharger</button>
    </li>
  ))}
</ul>

      <button onClick={handleLogout}>Déconnexion</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default DocApp;