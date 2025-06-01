# NFT Filter & Manager Guide

## Overview

The ArtCrate platform now includes powerful features to manage NFTs that don't display properly, allowing you to maintain a clean gallery of only your best NFTs.

## Features

### 1. **Gallery Filter Toggle**
Located in the top-right of the Gallery tab, this toggle allows you to:
- **Show All NFTs**: Display everything, including broken NFTs
- **Show Good NFTs**: Only display NFTs with valid images and metadata

The filter automatically:
- Checks if NFTs have proper titles (not just "NFT #ID")
- Verifies metadata is not placeholder text
- Tests if images actually load
- Remembers your preference for next time

### 2. **NFT Manager**
Appears above the gallery when you have problematic NFTs. Features include:

#### Bad NFT Detection
Automatically identifies NFTs with:
- Missing images
- Placeholder metadata ("IPFS metadata (not cached)")
- Generic titles ("NFT #13")
- Failed image loads

#### Hide NFTs
- Select individual NFTs or use "Select All"
- Hide selected NFTs from your gallery
- Hidden NFTs won't appear even after refresh
- Can unhide all NFTs with "Show All" button

#### Fix Metadata
- Attempts to re-fetch metadata from IPFS
- Clears bad cache entries
- Reloads NFT data from blockchain

## How to Use

### Quick Clean Gallery
1. Go to Gallery tab
2. Click the filter toggle to "Show Good NFTs"
3. Only NFTs with valid images will display

### Permanent Cleanup
1. Look for the NFT Manager box (red/orange)
2. Review the list of problematic NFTs
3. Click "Select All" or choose specific ones
4. Click "Hide Selected" to remove them
5. They won't appear again unless you click "Show All"

### Try to Fix NFTs
1. In NFT Manager, click "Try Fix Metadata"
2. Wait for the process to complete
3. Check if any NFTs were recovered

## Understanding the Status

### Filter Button States
- **Yellow (Eye Off icon)**: Showing all NFTs
- **Green (Eye icon)**: Showing only good NFTs
- Shows count: "Showing X of Y NFTs"

### NFT Manager Colors
- **Green box**: All NFTs are good!
- **Orange/Red box**: Found problematic NFTs
- Shows count of hidden NFTs if any

## Tips

1. **First Time Setup**
   - Use the filter to see which NFTs display well
   - Hide the ones that don't
   - Your gallery will look professional

2. **Regular Maintenance**
   - Check NFT Manager occasionally
   - New NFTs might have issues
   - Use "Try Fix Metadata" before hiding

3. **Recovering Hidden NFTs**
   - Click "Show All" in NFT Manager
   - All hidden NFTs return to gallery
   - You can re-evaluate them

## Technical Details

### What Makes an NFT "Good"?
- Has a custom title (not generic)
- Has real description (not placeholder)
- Has an image URL
- Image actually loads within 3 seconds

### Storage
- Filter preference saved in browser
- Hidden NFT list saved locally
- Survives page refreshes
- Cleared if you clear browser data

### Performance
- Image checking happens in background
- Doesn't slow down initial load
- Updates automatically when done

## Troubleshooting

### NFTs Still Showing as Bad
1. Try "Fix Metadata" first
2. Check your internet connection
3. IPFS gateways might be slow
4. Some NFTs might be permanently broken

### Hidden NFTs by Mistake
1. Click "Show All" in NFT Manager
2. All NFTs return immediately
3. Re-select which ones to hide

### Filter Not Working
1. Refresh the page
2. Check browser console for errors
3. Clear browser cache if needed
4. Re-connect wallet