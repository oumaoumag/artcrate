# ArtCrate Frontend Integration

This frontend is fully integrated with the ArtPlatform smart contract and provides a complete Web3 experience for minting NFTs and earning Creator Tokens.

## Features

✅ **Smart Contract Integration**
- Full integration with ArtPlatform.sol contract
- Real-time token balance updates
- NFT minting with automatic token rewards
- Network detection and switching

✅ **Web3 Functionality**
- MetaMask wallet connection
- Lisk Sepolia network support
- Transaction handling with proper error management
- Real-time balance updates

✅ **User Interface**
- Afrofuturistic design theme
- Responsive layout with Tailwind CSS
- Interactive components with loading states
- Real-time feedback and notifications

✅ **NFT Management**
- Upload and preview images
- Create metadata for NFTs
- View minted NFT gallery
- Track minting activity and rewards

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your contract address
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

## Smart Contract Integration

The frontend integrates with the following contract functions:

### NFT Functions
- `mintNFT(string metadataURI)` - Mint new NFT and earn tokens
- `tokenURI(uint256 tokenId)` - Get NFT metadata
- `nftBalanceOf(address owner)` - Get user's NFT count
- `creators(uint256 tokenId)` - Get NFT creator address

### Token Functions
- `tokenBalanceOf(address account)` - Get token balance
- `tokenTransfer(address to, uint256 amount)` - Transfer tokens
- `rewardAmount()` - Get current reward amount per mint

### Contract Info
- `nftTotalSupply()` - Total NFTs minted
- `tokenTotalSupply()` - Total tokens in circulation
- `MAX_NFT_SUPPLY()` - Maximum NFT supply
- `MAX_TOKEN_SUPPLY()` - Maximum token supply

## Configuration

Update `frontend/src/config/contracts.js` with your deployed contract address:

```javascript
export const CONTRACTS = {
  ART_PLATFORM: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
};
```

## Network Support

Currently configured for:
- **Lisk Sepolia Testnet** (Chain ID: 4202)
- Automatic network switching
- Network validation and error handling

## IPFS Integration

The app includes IPFS utilities for metadata storage:
- Mock IPFS implementation for demo
- Ready for Pinata/Infura integration
- Configurable through environment variables

## Components Overview

- **Header**: Wallet connection and network status
- **TokenBalance**: Display CTK token balance
- **MintForm**: NFT creation interface
- **Gallery**: Display minted NFTs
- **MintingLog**: Activity history
- **StatsOverview**: Platform statistics

## Error Handling

- Network validation
- Transaction error handling
- Loading states for all operations
- User-friendly error messages

## Next Steps

1. Deploy your smart contract to Lisk Sepolia
2. Update the contract address in configuration
3. Set up IPFS service (Pinata recommended)
4. Test the complete flow
5. Deploy to production

## Troubleshooting

**Common Issues:**
- Ensure MetaMask is installed
- Check network configuration
- Verify contract address is correct
- Confirm contract is deployed and verified
