# Troubleshooting NFT Display Issues

## Quick Checklist

1. **Environment Setup**
   - [ ] Copy `.env.example` to `.env`
   - [ ] Add Pinata API keys (optional - app works without them)
   - [ ] Restart the development server after adding `.env`

2. **Browser Console Debug**
   ```javascript
   // Run this in browser console
   debugNFTs()
   ```

3. **Common Issues and Solutions**

### Issue: NFTs not showing after minting

**Solution 1: Check localStorage**
```javascript
// In browser console
localStorage.getItem('userNFTs')
```

**Solution 2: Force reload NFTs**
```javascript
// In browser console
location.reload()
```

### Issue: Images not loading

**Possible causes:**
- IPFS gateway is down
- CORS issues with IPFS
- Image URL format is incorrect

**Solutions:**
- The updated NFTCard component will try multiple IPFS gateways
- If using Pinata, ensure API keys are correct
- Without Pinata, images are stored as data URLs (no IPFS needed)

### Issue: "Wrong Network" message

**Solution:**
1. Open MetaMask
2. Switch to Lisk Sepolia network
3. If network not added, the app will prompt to add it

### Issue: Metadata not loading

**Check:**
```javascript
// See what metadata is stored
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('metadata_')) {
        console.log(key, localStorage.getItem(key));
    }
}
```

## Development Tips

1. **Clear localStorage if needed:**
   ```javascript
   // WARNING: This will remove all stored NFTs
   localStorage.clear()
   ```

2. **Test without IPFS:**
   - Don't add Pinata keys to `.env`
   - App will use data URLs instead
   - Good for local testing

3. **Monitor Network tab:**
   - Open DevTools > Network
   - Look for failed IPFS requests
   - Check which gateways are working

## Architecture Overview

```
User mints NFT
    ↓
Image uploaded (IPFS or data URL)
    ↓
Metadata created and uploaded
    ↓
Contract.mintNFT() called
    ↓
NFT stored in localStorage
    ↓
Gallery displays from localStorage
    ↓
Contract data synced on load
```

## Need More Help?

1. Check browser console for errors
2. Run `debugNFTs()` and share the output
3. Check React DevTools for Web3Context state
4. Verify contract is deployed on Lisk Sepolia