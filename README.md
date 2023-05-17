# Projet de Stockage de Documents sur IPFS avec Création de NFT

Ce projet est une application web permettant de stocker des documents sur IPFS (InterPlanetary File System) et de créer des NFTs (Non-Fungible Tokens) représentant ces documents. Il utilise la technologie blockchain Ethereum pour la création et la gestion des NFTs.

## Fonctionnalités

- Téléchargement de documents : Les utilisateurs peuvent sélectionner et télécharger des documents à partir de leur appareil.
- Stockage sur IPFS : Les documents téléchargés sont automatiquement envoyés sur IPFS pour un stockage décentralisé et immuable.
- Création de NFT : Un NFT est automatiquement créé pour chaque document téléchargé. Les métadonnées du NFT sont stockées sur IPFS.
- Minting de NFT : Les NFTs nouvellement créés sont mintés (générés) sur la blockchain Ethereum, ce qui permet de les transférer, les vendre ou les échanger.
- Visualisation des informations : Les utilisateurs peuvent voir les empreintes IPFS des documents, les URL des métadonnées et les identifiants des NFTs mintés.

## Prérequis

- Node.js : Version 14 ou supérieure
- Un compte sur IPFS pour obtenir une clé d'API
- Un compte Ethereum et un fournisseur Web3 pour interagir avec la blockchain

## Installation

1. Clonez ce dépôt de code sur votre machine locale.
2. Installez les dépendances en exécutant la commande suivante :

```shell
npm install
IPFS_API_KEY=<VOTRE_CLÉ_API_IPFS>
ETH_PROVIDER_URL=<URL_DU_FOURNISSEUR_WEB3>

