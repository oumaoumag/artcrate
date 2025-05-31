// Debug utility for NFT display issues
// Run this in the browser console to diagnose problems

const debugNFTs = () => {
    console.log('=== NFT Debug Info ===');
    
    // Check localStorage
    console.log('\n1. Checking localStorage:');
    const nfts = [];
    const metadata = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('nft_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                nfts.push({ key, data });
            } catch (e) {
                console.error(`Failed to parse ${key}:`, e);
            }
        }
        if (key.startsWith('metadata_')) {
            try {
                const data = localStorage.getItem(key);
                metadata.push({ key, data: data.substring(0, 100) + '...' });
            } catch (e) {
                console.error(`Failed to read ${key}:`, e);
            }
        }
    }
    
    console.log(`Found ${nfts.length} NFTs in localStorage:`, nfts);
    console.log(`Found ${metadata.length} metadata entries:`, metadata);
    
    // Check userNFTs
    try {
        const userNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
        console.log(`\nUser NFTs array (${userNFTs.length} items):`, userNFTs);
    } catch (e) {
        console.error('Failed to parse userNFTs:', e);
    }
    
    // Check environment
    console.log('\n2. Environment Check:');
    console.log('Pinata API Key configured:', !!process.env.REACT_APP_PINATA_API_KEY);
    console.log('Contract Address:', process.env.REACT_APP_CONTRACT_ADDRESS);
    
    // Test IPFS gateways
    console.log('\n3. Testing IPFS Gateways:');
    const testHash = 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'; // Example hash
    const gateways = [
        'https://gateway.pinata.cloud/ipfs/',
        'https://ipfs.io/ipfs/',
        'https://cloudflare-ipfs.com/ipfs/',
        'https://dweb.link/ipfs/',
        'https://w3s.link/ipfs/'
    ];
    
    gateways.forEach(async (gateway) => {
        try {
            const response = await fetch(gateway + testHash, { method: 'HEAD' });
            console.log(`${gateway}: ${response.ok ? '✅ Working' : '❌ Failed'}`);
        } catch (e) {
            console.log(`${gateway}: ❌ Error - ${e.message}`);
        }
    });
    
    // Check React context (if available)
    console.log('\n4. React Context:');
    try {
        // This is a hacky way to access React DevTools data
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook) {
            console.log('React DevTools detected');
            // You'll need to manually inspect the Web3Context in React DevTools
        } else {
            console.log('React DevTools not available');
        }
    } catch (e) {
        console.error('Error accessing React context:', e);
    }
    
    console.log('\n=== End Debug Info ===');
};

// Export for use
window.debugNFTs = debugNFTs;

// Instructions
console.log(`
🔍 NFT Debug Utility Loaded!

To debug NFT display issues, run:
  debugNFTs()

This will show:
- NFTs stored in localStorage
- Environment configuration
- IPFS gateway status
- React context info

For more detailed debugging:
1. Open React DevTools
2. Search for "Web3Context"
3. Check the "mintedNFTs" state
`);

export default debugNFTs;