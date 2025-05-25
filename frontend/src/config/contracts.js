// Contract configuration
export const CONTRACTS = {
  // ArtPlatform contract deployed on Lisk Sepolia
  ART_PLATFORM: process.env.REACT_APP_CONTRACT_ADDRESS || "0xC11a4C0bbC828173FB39909C0E81e9251b07B880",
};

// Network configuration
export const NETWORKS = {
  LISK_SEPOLIA: {
    chainId: "0x106a", // 4202 in hex
    chainName: "Lisk Sepolia Testnet",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
    blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
  },
};

// IPFS configuration
export const IPFS_CONFIG = {
  gateway: "https://ipfs.io/ipfs/",
  // You can use services like Pinata, Infura, or your own IPFS node
  uploadEndpoint: process.env.REACT_APP_IPFS_ENDPOINT || "https://api.pinata.cloud/pinning/pinFileToIPFS",
  apiKey: process.env.REACT_APP_PINATA_API_KEY,
  secretKey: process.env.REACT_APP_PINATA_SECRET_KEY,
};
