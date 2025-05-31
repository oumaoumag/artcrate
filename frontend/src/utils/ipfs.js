import { IPFS_CONFIG } from '../config/contracts';

// IPFS upload function
export const uploadToIPFS = async (file, setProgress = () => {}) => {
  setProgress('Uploading image...');
  
  // Check if API keys are configured
  if (!IPFS_CONFIG.apiKey || !IPFS_CONFIG.secretKey) {
    console.warn('Pinata API keys not configured, using data URL fallback');
    setProgress('Using local storage for image...');
    
    // Convert to data URL for local storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setProgress('Image processed successfully');
        resolve({
          success: true,
          hash: 'local_' + Date.now(),
          url: dataUrl,
        });
      };
      reader.onerror = (error) => {
        setProgress(`Failed to read file: ${error.message}`);
        resolve({ success: false, error: error.message });
      };
      reader.readAsDataURL(file);
    });
  }
  
  try {
   const formData = new FormData();
   formData.append('file', file);

   const response = await fetch(IPFS_CONFIG.uploadEndpoint, {
    method: 'POST',
    headers: {
      'pinata_api_key': IPFS_CONFIG.apiKey,
      'pinata_secret_api_key': IPFS_CONFIG.secretKey,
    },
    body: formData,
   });

   if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.statusText}`);
   }
   const data = await response.json();
   setProgress('Image uploaded successfully');
   return {
      success: true,
      hash: data.IpfsHash, 
      url: `${IPFS_CONFIG.gateway}${data.IpfsHash}`,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    setProgress(`Upload failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Upload metadata to IPFS - using simple hash for demo
export const uploadMetadataToIPFS = async (metadata) => {
  // Check if API keys are configured
  if (!IPFS_CONFIG.apiKey || !IPFS_CONFIG.secretKey) {
    console.warn('Pinata API keys not configured, using base64 data URL for metadata');
    
    // Convert metadata to base64 data URL
    const jsonString = JSON.stringify(metadata);
    const base64 = btoa(jsonString);
    const dataUrl = `data:application/json;base64,${base64}`;
    
    // Store metadata in localStorage for retrieval
    const hash = 'local_metadata_' + Date.now();
    localStorage.setItem(`metadata_${hash}`, jsonString);
    
    return {
      success: true,
      hash: hash,
      url: dataUrl,
    };
  }
  
  try {
   const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': IPFS_CONFIG.apiKey,
      'pinata_secret_api_key': IPFS_CONFIG.secretKey,
    },
    body: JSON.stringify(metadata),
   });

   if (!response.ok) {
    throw new Error(`Metadata upload failed: ${response.statusText}`);
   }

   const data = await response.json();
   return {
    success: true,
    hash: data.IpfsHash,
    url: `${IPFS_CONFIG.gateway}${data.IpfsHash}`,
   };
  } catch (error) {
    console.error('Metadata upload error:', error);
    return {success: false, error: error.message };
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
