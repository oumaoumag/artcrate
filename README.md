Great! Here's a complete, clean, and professional `README.md` template for your **ArtCrate** project — perfect for GitHub:

---

````markdown
# 🎨 ArtCrate

*A token-powered NFT platform that rewards creators with every mint.*

ArtCrate is a decentralized application (dApp) that allows users to mint and collect NFTs representing unique digital artwork. Every time someone mints an NFT, the original creator automatically receives ERC20 tokens as a reward. ArtCrate is built on Solidity and React, and deployed on Lisk Sepolia.

---

## 🚀 Features

- ✅ **ERC721 NFT Collection**  
  Mint NFTs with metadata and assign creator attribution.

- 💰 **ERC20 Token Rewards**  
  Creators earn a fixed amount of tokens for every NFT minted by others.

- 🌐 **IPFS Integration**  
  Metadata and images are stored on IPFS using Pinata or NFT.Storage.

- 👛 **Web3 Wallet Support**  
  Connect MetaMask and interact with smart contracts directly from the UI.

- 🖼️ **NFT Gallery**  
  Browse all minted NFTs with creator addresses and token IDs.

- 📊 **Reward Dashboard**  
  Track token balances and minting events in real time.

---

## 🧱 Smart Contracts

### `ArtNFT.sol`
- ERC721-compatible NFT contract.
- Public minting with metadata URI.
- Tracks original creator of each NFT.
- Emits `NFTMinted` event on mint.
- Calls `rewardCreator()` from ERC20 token.

### `CreatorToken.sol`
- ERC20-compatible token.
- Minted internally by the contract to reward creators.
- Functions: `rewardCreator`, `balanceOf`, `transfer`, `approve`, `transferFrom`, `allowance`.

---

## 🖥 Frontend

Built with React + ethers.js:

- Connect to MetaMask
- Upload image & metadata to IPFS
- Mint NFTs and get confirmation
- Display token balance and mint logs
- Browse NFT gallery with metadata and creator info

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+)
- MetaMask wallet
- Lisk Sepolia testnet account
- IPFS key for Pinata or NFT.Storage

### Clone the Repository

```bash
git clone https://github.com/oumaoumag/artcrate.git
cd artcrate
````

### Install Dependencies

```bash
# Install smart contract tools
cd contracts
npm install

# Compile & deploy contracts (e.g., using Hardhat)
npx hardhat compile
npx hardhat run scripts/deploy.js --network liskSepolia

# Install frontend
cd ../frontend
npm install
```

### Run the App

```bash
npm run dev
```

---

## 🌍 Deployment

* **Contracts** deployed on: `Lisk Sepolia`
* **Frontend** hosted on: \[Netlify/Vercel link]

---

## 📄 License

MIT License. See `LICENSE` file for details.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change or add.


