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
    const hashFixes = {
        'Qm4jgdohguosph4nnzi68wdu': 'QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with actual full hash
        'Qmhtgzkg2ws7ftkk9e7mqe9c': 'QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        'Qm0akve0hzjrm62bkmsi5bcei': 'QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    };
    
    for (const nft of userNFTs) {
        let updated = false;
        
        // Check image URL
        if (nft.image) {
            for (const [truncated, full] of Object.entries(hashFixes)) {
                if (nft.image.includes(truncated)) {
                    nft.image = nft.image.replace(truncated, full);
                    updated = true;
                    fixedHashes++;
                    console.log(`Fixed hash in NFT ${nft.id}: ${truncated} -> ${full}`);
                }
            }
        }
        
        // Check tokenURI
        if (nft.tokenURI) {
            for (const [truncated, full] of Object.entries(hashFixes)) {
                if (nft.tokenURI.includes(truncated)) {
                    nft.tokenURI = nft.tokenURI.replace(truncated, full);
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

// Export to window for console access
if (typeof window !== 'undefined') {
    window.fixAllNFTIssues = fixAllNFTIssues;
    window.fixSpecificNFTs = fixSpecificNFTs;
    
    // Auto-run message
    console.log('🛠️ NFT Fix Utilities Loaded!');
    console.log('Run fixAllNFTIssues() to fix all NFT display issues');
    console.log('Run fixSpecificNFTs([6, 7, 8]) to fix specific NFT IDs');
}