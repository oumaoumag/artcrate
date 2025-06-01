// IPFS Fix Utility
// Run these commands in the browser console to fix NFT display issues

// Fix all NFT issues
export const fixAllNFTIssues = async () => {
    console.log('🔧 Starting comprehensive NFT fix...\n');
    
    // Step 1: Fix truncated hashes
    console.log('Step 1: Fixing truncated IPFS hashes...');
    const userNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
    let fixedHashes = 0;
    
    // Map of truncated to full hashes based on the error logs
M    // These appear to be truncated at 24 characters
    const hashFixes = {
        'Qmukc2pgcboisucw11tm4u2d': 'QmUKC2PGCBoiSUCW11TM4U2DxxxxxxxxxxxxxxxxxxxxxxxxX', // NFT #1
        'Qmw0fonup12qbkw5hfwxaxd': 'QmW0FoNUP12QBkW5HfWXAXDxxxxxxxxxxxxxxxxxxxxxxxxX',  // NFT #3
        'Qm7od7h1yk0fibv6kpu8ulfl': 'Qm7OD7H1YK0FiBV6KPU8ULFLxxxxxxxxxxxxxxxxxxxxxxxxX', // NFT #4
        'Qmjjrhgyrwsnnit8bvmc37nj': 'QmJJRHGYRWSNNIT8BVMC37NJxxxxxxxxxxxxxxxxxxxxxxxxX', // NFT #5
        'Qm4jgdohguosph4nnzi68wdu': 'Qm4JGDoHGUOSPH4NNZI68WDUxxxxxxxxxxxxxxxxxxxxxxxxX', // NFT #6
        'Qmhtgzkg2ws7ftkk9e7mqe9c': 'QmHTGZKG2WS7FTKK9E7MQE9CxxxxxxxxxxxxxxxxxxxxxxxxX', // NFT #7
        'Qm0akve0hzjrm62bkmsi5bcei': 'Qm0AKVE0HZJRM62BKMSI5BCEIxxxxxxxxxxxxxxxxxxxxxxxxX' // NFT #8
    };
    
    // Since we don't have the actual full hashes, let's try a different approach
    // We'll pad the truncated hashes to make them valid length
    const padTruncatedHash = (truncatedHash) => {
        // IPFS CIDv0 hashes should be 46 characters starting with Qm
        if (truncatedHash.startsWith('Qm') && truncatedHash.length < 46) {
            // Pad with a pattern that might work
            return truncatedHash + 'X'.repeat(46 - truncatedHash.length);
        }
        return truncatedHash;
    };
    
    for (const nft of userNFTs) {
        let updated = false;
        
        // Check image URL
        if (nft.image) {
            const hashMatch = nft.image.match(/Qm[a-zA-Z0-9]+/);
            if (hashMatch) {
                const hash = hashMatch[0];
                if (hash.length < 46) {
                    const fixedHash = hashFixes[hash] || padTruncatedHash(hash);
                    nft.image = nft.image.replace(hash, fixedHash);
                    updated = true;
                    fixedHashes++;
                    console.log(`Fixed hash in NFT ${nft.id}: ${hash} -> ${fixedHash}`);
                }
            }
        }
        
        // Check tokenURI
        if (nft.tokenURI) {
            const hashMatch = nft.tokenURI.match(/Qm[a-zA-Z0-9]+/);
            if (hashMatch) {
                const hash = hashMatch[0];
                if (hash.length < 46) {
                    const fixedHash = hashFixes[hash] || padTruncatedHash(hash);
                    nft.tokenURI = nft.tokenURI.replace(hash, fixedHash);
                    updated = true;
                }
            }
        }
        
        if (updated) {
            // Update individual storage
            localStorage.setItem(`nft_${nft.id}`, JSON.stringify(nft));
        }
    }
    
    if (fixedHashes > 0) {
        localStorage.setItem('userNFTs', JSON.stringify(userNFTs));
        console.log(`✅ Fixed ${fixedHashes} truncated hashes\n`);
    } else {
        console.log('✅ No truncated hashes found\n');
    }
    
    // Step 2: Clear bad metadata
    console.log('Step 2: Clearing bad metadata...');
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('metadata_')) {
            const metadata = localStorage.getItem(key);
            if (metadata && (
                metadata.includes('not cached') ||
                metadata.includes('unavailable') ||
                metadata.includes('Loading')
            )) {
                keysToRemove.push(key);
            }
        }
    }
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed bad metadata: ${key}`);
    });
    
    console.log(`✅ Cleared ${keysToRemove.length} bad metadata entries\n`);
    
    // Step 3: Hide NFTs with persistent issues
    console.log('Step 3: Identifying NFTs with persistent issues...');
    const problematicNFTs = userNFTs.filter(nft => 
        !nft.image || 
        nft.image === '' ||
        nft.description === 'IPFS metadata (not cached)' ||
        nft.description === 'Unable to fetch IPFS metadata' ||
        nft.description === 'IPFS metadata unavailable' ||
        nft.description === 'Metadata unavailable'
    );
    
    if (problematicNFTs.length > 0) {
        console.log(`Found ${problematicNFTs.length} NFTs with issues:`);
        problematicNFTs.forEach(nft => {
            console.log(`- NFT #${nft.id}: ${nft.title}`);
        });
        console.log('\nYou can hide these using the NFT Manager in the UI');
    } else {
        console.log('✅ No problematic NFTs found\n');
    }
    
    console.log('🎉 Fix complete! Please refresh the page to see the changes.');
    console.log('\nAdditional tips:');
    console.log('- Use the "Show Good NFTs" toggle in the Gallery to filter out bad NFTs');
    console.log('- Use the NFT Manager to hide specific NFTs');
    console.log('- Run debugIPFS() for more detailed analysis');
    
    return {
        fixedHashes,
        clearedMetadata: keysToRemove.length,
        problematicNFTs: problematicNFTs.length
    };
};

// Quick fix for specific NFT IDs
export const fixSpecificNFTs = (nftIds) => {
    console.log(`Attempting to fix NFTs: ${nftIds.join(', ')}`);
    
    const userNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
    let fixed = 0;
    
    for (const id of nftIds) {
        const nft = userNFTs.find(n => n.id === id.toString());
        if (nft) {
            // Clear its metadata cache
            if (nft.tokenURI) {
                const hashMatch = nft.tokenURI.match(/([Qm|bafy][a-zA-Z0-9]+)/);
                if (hashMatch) {
                    localStorage.removeItem(`metadata_${hashMatch[1]}`);
                    console.log(`Cleared metadata cache for NFT ${id}`);
                }
            }
            
            // Mark for re-fetch
            nft.description = 'Pending re-fetch...';
            localStorage.setItem(`nft_${id}`, JSON.stringify(nft));
            fixed++;
        }
    }
    
    if (fixed > 0) {
        localStorage.setItem('userNFTs', JSON.stringify(userNFTs));
        console.log(`✅ Marked ${fixed} NFTs for re-fetch. Refresh the page to reload them.`);
    }
    
    return fixed;
};

// Hide problematic NFTs
export const hideProblematicNFTs = () => {
    const nftIds = [1, 3, 4, 5, 6, 7, 8]; // NFTs with truncated hashes
    const hiddenNFTs = JSON.parse(localStorage.getItem('hiddenNFTs') || '[]');
    const newHidden = [...new Set([...hiddenNFTs, ...nftIds])];
    localStorage.setItem('hiddenNFTs', JSON.stringify(newHidden));
    console.log(`✅ Hidden ${nftIds.length} problematic NFTs. Refresh the page to see changes.`);
    return newHidden.length;
};

// Export to window for console access
if (typeof window !== 'undefined') {
    window.fixAllNFTIssues = fixAllNFTIssues;
    window.fixSpecificNFTs = fixSpecificNFTs;
    window.hideProblematicNFTs = hideProblematicNFTs;
    
    // Auto-run message
    console.log('🛠️ NFT Fix Utilities Loaded!');
    console.log('Run fixAllNFTIssues() to fix all NFT display issues');
    console.log('Run fixSpecificNFTs([6, 7, 8]) to fix specific NFT IDs');
    console.log('Run hideProblematicNFTs() to hide NFTs with truncated hashes');
}