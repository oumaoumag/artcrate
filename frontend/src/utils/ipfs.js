import { IPFS_CONFIG } from '../config/contracts';

// Simple IPFS upload function (you can replace this with Pinata, Infura, or other services)
export const uploadToIPFS = async (file, metadata) => {
  try {
    // For demo purposes, we'll create a mock IPFS hash
    // In production, you would upload to a real IPFS service
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      hash: mockHash,
      url: `${IPFS_CONFIG.gateway}${mockHash}`,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload metadata to IPFS
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    // Create metadata JSON
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });
    
    // For demo purposes, create a mock hash
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      hash: mockHash,
      url: `${IPFS_CONFIG.gateway}${mockHash}`,
    };
  } catch (error) {
    console.error('Metadata upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Fetch metadata from IPFS
export const fetchFromIPFS = async (hash) => {
  try {
    const response = await fetch(`${IPFS_CONFIG.gateway}${hash}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }
    return await response.json();
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw error;
  }
};

// Create NFT metadata object
export const createNFTMetadata = (title, description, imageHash, creator) => {
  return {
    name: title,
    description: description,
    image: `${IPFS_CONFIG.gateway}${imageHash}`,
    attributes: [
      {
        trait_type: "Creator",
        value: creator,
      },
      {
        trait_type: "Created",
        value: new Date().toISOString(),
      },
    ],
  };
};
