# How to Fix "IPFS metadata (not cached)" Error

## Quick Fix

1. **Go to the Debug tab** (visible in development mode)
2. **Click "Fix Bad Metadata"** button
3. Wait for NFTs to reload automatically
4. Check the Gallery tab - your NFTs should now display properly

## Alternative Methods

### Method 1: Force Reload
1. Go to Debug tab
2. Click "Force Reload NFTs"
3. This will re-fetch all NFT data from the blockchain

### Method 2: Clear All Cache
1. Go to Debug tab  
2. Click "Clear All Cache"
3. Click "Force Reload NFTs"
4. This completely refreshes all NFT data

## What Causes This Issue?

The "IPFS metadata (not cached)" message appears when:
- NFT metadata is stored on IPFS but couldn't be fetched
- The app saved a placeholder instead of actual metadata
- IPFS gateways were temporarily unavailable

## How the Fix Works

The "Fix Bad Metadata" button:
1. Finds all NFTs with placeholder metadata
2. Removes them from cache
3. Re-fetches the actual metadata from IPFS
4. Uses multiple IPFS gateways for reliability

## Prevention

The app now automatically:
- Cleans bad metadata on startup
- Tries multiple IPFS gateways when fetching
- Skips cached NFTs with placeholder data
- Re-fetches metadata when needed

## Manual Browser Fix

If the Debug tab isn't available:
1. Open browser DevTools (F12)
2. Go to Console
3. Run: `localStorage.clear()`
4. Refresh the page
5. Reconnect your wallet

This will clear all cached data and force a fresh load.