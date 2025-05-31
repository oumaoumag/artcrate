// IPFS Debug Utility
// This utility helps debug and fix IPFS-related issues with NFTs

export const debugIPFS = () => {
    console.log('🔍 IPFS Debug Utility');
    
    // Check all NFTs in localStorage
    const userNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
    console.log(`Found ${userNFTs.length} NFTs in localStorage`);
    
    // Analyze each NFT
    const issues = {
        truncatedHashes: [],
        invalidHashes: [],
        missingImages: [],
        corsIssues: [],
        goodNFTs: []
    };
    
    userNFTs.forEach(nft => {
        console.log(`\nAnalyzing NFT #${nft.id}:`);
        console.log(`- Title: ${nft.title}`);
        console.log(`- Description: ${nft.description}`);
        console.log(`- Image: ${nft.image}`);
        console.log(`- TokenURI: ${nft.tokenURI}`);
        
        // Check for issues
        if (!nft.image) {
            issues.missingImages.push(nft);
            console.warn('❌ Missing image URL');
        } else {
            // Extract IPFS hash from image URL
            const hashMatch = nft.image.match(/(?:ipfs\/|^)([Qm|bafy][a-zA-Z0-9]+)/);
            if (hashMatch) {
                const hash = hashMatch[1];
                console.log(`- IPFS Hash: ${hash} (${hash.length} chars)`);
                
                if (hash.startsWith('Qm') && hash.length < 46) {
                    issues.truncatedHashes.push({ nft, hash });
                    console.warn(`❌ Truncated IPFS hash (should be 46 chars for CIDv0)`);
                } else if (hash.startsWith('bafy') && hash.length < 59) {
                    issues.truncatedHashes.push({ nft, hash });
                    console.warn(`❌ Truncated IPFS hash (should be 59+ chars for CIDv1)`);
                } else {
                    console.log('✅ Valid IPFS hash length');
                }
            }
        }
        
        // Check metadata
        if (nft.description === 'IPFS metadata (not cached)' ||
            nft.description === 'Unable to fetch IPFS metadata' ||
            nft.description === 'IPFS metadata unavailable' ||
            nft.description === 'Metadata unavailable') {
            console.warn('❌ Placeholder metadata detected');
        } else if (nft.description) {
            console.log('✅ Has proper metadata');
            issues.goodNFTs.push(nft);
        }
    });
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Total NFTs: ${userNFTs.length}`);
    console.log(`- Good NFTs: ${issues.goodNFTs.length}`);
    console.log(`- Missing images: ${issues.missingImages.length}`);
    console.log(`- Truncated hashes: ${issues.truncatedHashes.length}`);
    
    // Provide fix suggestions
    if (issues.truncatedHashes.length > 0) {
        console.log('\n🔧 Fix Suggestions:');
        console.log('The following NFTs have truncated IPFS hashes:');
        issues.truncatedHashes.forEach(({ nft, hash }) => {
            console.log(`- NFT #${nft.id}: ${hash}`);
            
            // Try to find the full hash from tokenURI
            if (nft.tokenURI) {
                const fullHashMatch = nft.tokenURI.match(/([Qm|bafy][a-zA-Z0-9]{44,})/);
                if (fullHashMatch) {
                    console.log(`  Possible full hash from tokenURI: ${fullHashMatch[0]}`);
                }
            }
        });
        
        console.log('\nTo fix these issues:');
        console.log('1. Clear the bad NFT cache using clearBadNFTCache()');
        console.log('2. Reload NFTs from the contract');
        console.log('3. Or manually hide these NFTs using the NFT Manager');
    }
    
    return issues;
};

// Test IPFS gateways
export const testIPFSGateways = async (hash = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB') => {
    console.log('🌐 Testing IPFS Gateways...');
    console.log(`Test hash: ${hash}`);
    
    const gateways = [
        'https://nftstorage.link/ipfs/',
        'https://w3s.link/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
        'https://ipfs.filebase.io/ipfs/',
        'https://gateway.ipfs.io/ipfs/',
        'https://dweb.link/ipfs/',
        'https://ipfs.io/ipfs/',
        'https://gateway.pinata.cloud/ipfs/'
    ];
    
    const results = [];
    
    for (const gateway of gateways) {
        const url = gateway + hash;
        console.log(`\nTesting ${gateway}...`);
        
        try {
            const startTime = Date.now();
            const response = await fetch(url, {
                method: 'HEAD',
                signal: AbortSignal.timeout(5000)
            });
            const endTime = Date.now();
            
            if (response.ok) {
                console.log(`✅ Success (${endTime - startTime}ms)`);
                results.push({ gateway, status: 'success', time: endTime - startTime });
            } else {
                console.log(`❌ Failed: ${response.status} ${response.statusText}`);
                results.push({ gateway, status: 'failed', error: `${response.status} ${response.statusText}` });
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
            results.push({ gateway, status: 'error', error: error.message });
        }
    }
    
    // Summary
    console.log('\n📊 Gateway Test Summary:');
    const working = results.filter(r => r.status === 'success');
    console.log(`Working gateways: ${working.length}/${gateways.length}`);
    
    if (working.length > 0) {
        console.log('\nFastest gateways:');
        working.sort((a, b) => a.time - b.time).forEach((r, i) => {
            console.log(`${i + 1}. ${r.gateway} (${r.time}ms)`);
        });
    }
    
    return results;
};

// Fix truncated hashes by attempting to reconstruct them
export const fixTruncatedHash = (truncatedHash, tokenURI) => {
    console.log(`Attempting to fix truncated hash: ${truncatedHash}`);
    
    // Common IPFS hash patterns
    const patterns = [
        // Full hash in URI
        new RegExp(`${truncatedHash}[a-zA-Z0-9]*`, 'i'),
        // Hash after /ipfs/
        /ipfs\/([Qm|bafy][a-zA-Z0-9]{44,})/i,
        // Just the hash
        /([Qm|bafy][a-zA-Z0-9]{44,})/
    ];
    
    for (const pattern of patterns) {
        const match = tokenURI.match(pattern);
        if (match && match[0].length >= 46) {
            console.log(`Found possible full hash: ${match[0]}`);
            return match[0];
        }
    }
    
    console.log('Could not reconstruct full hash');
    return null;
};

// Export to window for console access
if (typeof window !== 'undefined') {
    window.debugIPFS = debugIPFS;
    window.testIPFSGateways = testIPFSGateways;
    window.fixTruncatedHash = fixTruncatedHash;
}