# ArtCrate Platform - Smart Contract

A production-ready NFT platform smart contract that combines ERC721 NFTs with custom token rewards. When users mint NFTs, creators automatically earn Creator Tokens (CTK) as rewards.

## 🚀 Live Deployment

**Contract Address:** `0x8BFadD14aA52762CE38DAaeA3538Dcadf126d4D8`
**Network:** Lisk Sepolia Testnet
**Explorer:** [View on Blockscout](https://sepolia-blockscout.lisk.com/address/0x8BFadD14aA52762CE38DAaeA3538Dcadf126d4D8)

## ✨ Features

✅ **Dual Token System**
- ERC721 NFTs for unique digital art pieces
- Custom ERC20-like tokens (CTK) for creator rewards

✅ **Automatic Rewards**
- 10 CTK tokens earned per NFT mint
- Configurable reward amounts (owner only)

✅ **Security Features**
- OpenZeppelin security standards
- Reentrancy protection on all state-changing functions
- Pausable functionality for emergency stops
- Owner-only administrative functions

✅ **Supply Limits**
- Max 10,000 NFTs (prevents oversupply)
- Max 1,000,000 CTK tokens (economic stability)
- Max 1,000 CTK reward per mint (prevents abuse)

## 🛠 Development Setup

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Lisk Sepolia ETH ([Faucet](https://sepolia-faucet.lisk.com/))

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd artcrate/contracts
   forge install
   ```

2. **Run Tests**
   ```bash
   forge test
   ```

3. **Deploy to Testnet**
   ```bash
   # Setup environment
   cp .env.example .env
   # Add your private key to .env

   # Deploy
   forge script script/DeployArtPlatform.s.sol:DeployArtPlatform --rpc-url https://rpc.sepolia-api.lisk.com --broadcast
   ```

## Testing

Run the comprehensive test suite:

```bash
forge test
```

## Contract Functions

### Public Functions

#### NFT Functions
- `mintNFT(string metadataURI)` - Mint NFT and earn tokens
- `nftBalanceOf(address owner)` - Get NFT balance
- `nftTotalSupply()` - Get total NFTs minted

#### Token Functions
- `tokenBalanceOf(address account)` - Get token balance
- `tokenTransfer(address to, uint256 amount)` - Transfer tokens
- `tokenTotalSupply()` - Get total token supply

### Owner Functions
- `setRewardAmount(uint256 newAmount)` - Update reward per mint
- `rewardCreator(address to, uint256 amount)` - Manual token reward
- `pause()` / `unpause()` - Emergency controls

## Foundry Commands

### Build
```shell
forge build
```

### Test
```shell
forge test
```

### Deploy
```shell
./deploy-simple.sh
```

### Format
```shell
forge fmt
```
