# IPFS Display Issues Fix

## The Problem

Your NFTs are stored on IPFS but the metadata cannot be fetched due to:
1. CORS (Cross-Origin Resource Sharing) blocking from IPFS gateways
2. Invalid or truncated IPFS hashes
3. Gateway availability issues

## Quick Fix

### Option 1: Use the Debug Tab
1. Go to the **Debug** tab
2. Click **"Fix Bad Metadata"**
3. Wait for the process to complete
4. Your NFTs should now display properly

### Option 2: Manual Console Fix
If the Debug tab doesn't work, open your browser console (F12) and run:

```javascript
// Clear all bad NFT data
localStorage.removeItem('nft_6');
localStorage.removeItem('nft_7');
localStorage.removeItem('nft_8');

// Clear the main NFT list
localStorage.removeItem('userNFTs');

// Reload the page
location.reload();
```

### Option 3: Use NFT Manager
1. Go to the **Gallery** tab
2. Look for the **NFT Manager** box (orange/red)
3. Select NFTs with "Unable to fetch IPFS metadata"
4. Click **"Hide Selected"** to remove them from view

## Prevention

### For New NFTs
When minting new NFTs:
1. Use smaller image files (< 5MB)
2. Ensure you have a stable internet connection
3. Wait for the "NFT minted successfully" message
4. The new filter system will automatically show recently minted NFTs

### IPFS Gateway Issues
The app now uses multiple IPFS gateways in order:
1. nftstorage.link (most reliable)
2. w3s.link
3. dweb.link
4. ipfs.io
5. gateway.pinata.cloud

## Understanding the Errors

### "Unable to fetch IPFS metadata"
- The IPFS hash exists but no gateway could retrieve it
- The metadata might be unpinned or lost
- Network issues preventing access

### "IPFS metadata (not cached)"
- The app found an IPFS hash but couldn't fetch the actual data
- Usually means the IPFS content is unavailable

### NFTs #16, #17 showing as bad
- These are newly minted NFTs
- The validation runs too quickly after minting
- They should appear correctly after a page refresh

## Advanced Troubleshooting

### Check IPFS Hash Manually
1. Get the IPFS hash from the console logs
2. Try accessing it directly:
   - `https://nftstorage.link/ipfs/[YOUR_HASH]`
   - `https://w3s.link/ipfs/[YOUR_HASH]`

### Force Refresh All NFTs
Run in console:
```javascript
// Get Web3 context
const ctx = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.get(1)?.getFiberRoots()?.values()?.next()?.value?.current?.memoizedState?.element?.props?.value;

// Clear bad cache and reload
if (ctx && ctx.clearBadNFTCache && ctx.loadUserNFTs) {
    ctx.clearBadNFTCache();
    await ctx.loadUserNFTs(ctx.contract, ctx.account);
}
```

## Long-term Solution

Consider using a dedicated IPFS pinning service:
1. **NFT.Storage** - Free, reliable, designed for NFTs
2. **Pinata** - Paid service with better uptime
3. **Infura IPFS** - Enterprise-grade solution

The app is configured to work best with NFT.Storage gateways.