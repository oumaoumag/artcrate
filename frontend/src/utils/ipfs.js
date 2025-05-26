import { IPFS_CONFIG } from '../config/contracts';

// Simple IPFS upload function - using data URLs for demo
export const uploadToIPFS = async (file, metadata) => {
  try {
   const formData =new FormData();
   formData.append('file', file);

   const response = await fetch(IPFS_CONFIG.uploadEndpoint, {
    method: 'POST',
    headers: {
      pinata_api_key: IPFS_CONFIG.apiKey,
      pinata_secret_api_key: IPFS_CONFIG.secretKey,
    },
    body: formData,
   });

    return {
      success: true,
      hash: mockHash,
      url: dataUrl, // Use data URL instead of fake IPFS URL
      dataUrl: dataUrl,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload metadata to IPFS - using simple hash for demo
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    // Create a simple hash instead of data URL to avoid transaction size limits
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store metadata in localStorage for retrieval
    const metadataJson = JSON.stringify(metadata);
    localStorage.setItem(`metadata_${mockHash}`, metadataJson);

    // Use a simple IPFS-style URL instead of data URL
    const ipfsUrl = `https://ipfs.io/ipfs/${mockHash}`;

    return {
      success: true,
      hash: mockHash,
      url: ipfsUrl,
      metadata: metadata,
    };
  } catch (error) {
    console.error('Metadata upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Fetch metadata from IPFS - handle localStorage and mock IPFS URLs
export const fetchFromIPFS = async (url) => {
  try {
    // Try to extract hash from URL and check localStorage first
    const hashMatch = url.match(/Qm[a-zA-Z0-9]+/);
    if (hashMatch) {
      const hash = hashMatch[0];
      const stored = localStorage.getItem(`metadata_${hash}`);
      if (stored) {
        return JSON.parse(stored);
      }
    }

    // If it's a data URL, decode it directly
    if (url.startsWith('data:application/json;base64,')) {
      const base64Data = url.split(',')[1];
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString);
    }

    // For IPFS URLs that we can't fetch due to CORS, return fallback metadata
    if (url.startsWith('https://ipfs.io/ipfs/') || url.startsWith('ipfs://')) {
      console.warn('Cannot fetch IPFS URL due to CORS, using fallback metadata');
      return {
        name: 'NFT',
        description: 'NFT with IPFS metadata',
        image: '',
      };
    }

    // Fallback: try to fetch as regular URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw error;
  }
};

// Create NFT metadata object
export const createNFTMetadata = (title, description, imageUrl, creator) => {
  return {
    name: title,
    description: description,
    image: imageUrl, // Use the actual image URL (data URL)
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
