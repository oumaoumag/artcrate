# NFT Display Flow Issues and Fixes

## Issues Identified

### 1. **IPFS Upload Configuration Issues**
- The IPFS configuration relies on environment variables that might not be set
- Pinata API keys are not configured properly

### 2. **Metadata Storage and Retrieval**
- The `loadUserNFTs` function in Web3Context has complex logic that might fail silently
- Metadata is stored in localStorage but retrieval logic is inconsistent
- IPFS URLs are not being properly converted to accessible gateway URLs

### 3. **Image URL Handling**
- The `getImageUrl` helper in Gallery.js is not being used
- NFTCard component doesn't handle IPFS URLs properly
- Multiple IPFS gateways are defined but not utilized

### 4. **Error Handling**
- Silent failures when fetching metadata from IPFS
- No proper error states in the UI components

## Fixes

### 1. Fix IPFS Configuration

Create a `.env` file in the frontend directory:
```env
REACT_APP_CONTRACT_ADDRESS=0xC11a4C0bbC828173FB39909C0E81e9251b07B880
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
```

### 2. Update IPFS Utils to Handle Errors Better

```javascript
// In utils/ipfs.js
export const uploadToIPFS = async (file, setProgress = () => {}) => {
  setProgress('Uploading image...');
  
  // Check if API keys are configured
  if (!IPFS_CONFIG.apiKey || !IPFS_CONFIG.secretKey) {
    console.warn('Pinata API keys not configured, using local storage fallback');
    // Convert to data URL for local storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        resolve({
          success: true,
          hash: 'local_' + Date.now(),
          url: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    });
  }
  
  // ... rest of the function
};
```

### 3. Fix NFTCard Image Display

```javascript
// In components/NFTCard.js
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300?text=NFT';
    
    // If it's a data URL, return as is
    if (imageUrl.startsWith('data:')) {
        return imageUrl;
    }
    
    // If it's already a full URL
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // If it's an IPFS URL with ipfs:// protocol
    if (imageUrl.startsWith('ipfs://')) {
        const hash = imageUrl.replace('ipfs://', '');
        // Try multiple gateways
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }
    
    // If it's just an IPFS hash
    if (imageUrl.match(/^Qm[a-zA-Z0-9]+$/)) {
        return `https://gateway.pinata.cloud/ipfs/${imageUrl}`;
    }
    
    // Default fallback
    return 'https://via.placeholder.com/300?text=NFT';
};
```

### 4. Simplify loadUserNFTs Function

```javascript
// In context/Web3Context.js
const loadUserNFTs = useCallback(async (contractInstance, userAddress) => {
    console.log('Loading NFTs for user:', userAddress);
    
    try {
        // Get NFT balance
        const nftBalance = await contractInstance.nftBalanceOf(userAddress);
        console.log('User has', nftBalance.toString(), 'NFTs');
        
        const nfts = [];
        
        for (let i = 0; i < nftBalance.toNumber(); i++) {
            try {
                const tokenId = await contractInstance.tokenOfOwnerByIndex(userAddress, i);
                const tokenURI = await contractInstance.tokenURI(tokenId);
                
                // Try to get metadata
                let metadata = {
                    name: `NFT #${tokenId}`,
                    description: 'Loading...',
                    image: ''
                };
                
                // Check localStorage first
                const storedNFT = localStorage.getItem(`nft_${tokenId}`);
                if (storedNFT) {
                    const parsed = JSON.parse(storedNFT);
                    nfts.push(parsed);
                    continue;
                }
                
                // Parse base64 metadata
                if (tokenURI.startsWith('data:application/json;base64,')) {
                    const base64Data = tokenURI.split(',')[1];
                    const jsonString = atob(base64Data);
                    metadata = JSON.parse(jsonString);
                }
                
                const nftData = {
                    id: tokenId.toString(),
                    title: metadata.name || `NFT #${tokenId}`,
                    description: metadata.description || '',
                    image: metadata.image || '',
                    owner: userAddress,
                    tokenURI: tokenURI,
                };
                
                nfts.push(nftData);
                
                // Store in localStorage
                localStorage.setItem(`nft_${tokenId}`, JSON.stringify(nftData));
                
            } catch (error) {
                console.error(`Error loading NFT ${i}:`, error);
            }
        }
        
        setMintedNFTs(nfts);
        
    } catch (error) {
        console.error('Error loading NFTs:', error);
    }
}, []);
```

### 5. Add Loading States

```javascript
// In components/Gallery.js
const Gallery = () => {
    const { mintedNFTs, isLoadingNFTs } = useWeb3();
    
    if (isLoadingNFTs) {
        return (
            <div style={cardStyles}>
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="spinner" />
                    <p style={{ color: '#fdba74' }}>Loading your NFTs...</p>
                </div>
            </div>
        );
    }
    
    // ... rest of component
};
```

## Testing Steps

1. **Check Environment Variables**
   - Ensure `.env` file exists with proper API keys
   - Restart the development server after adding env vars

2. **Test Without Pinata**
   - The app should work with data URLs if Pinata is not configured
   - Images will be stored as base64 in metadata

3. **Check Browser Console**
   - Look for any CORS errors when fetching from IPFS
   - Check if NFTs are being loaded from contract

4. **Verify Local Storage**
   - Open DevTools > Application > Local Storage
   - Check for `nft_*` and `metadata_*` entries

5. **Test Minting Flow**
   - Mint a new NFT
   - Check if it appears immediately in the gallery
   - Refresh the page and verify it's still there

## Quick Debug Commands

Run these in the browser console:

```javascript
// Check stored NFTs
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('nft_')) {
        console.log(key, JSON.parse(localStorage.getItem(key)));
    }
}

// Check Web3 context
const web3Context = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.get(1)?.getFiberRoots()?.values()?.next()?.value?.current?.memoizedState?.element?.props?.value;
console.log('Account:', web3Context?.account);
console.log('NFTs:', web3Context?.mintedNFTs);
```