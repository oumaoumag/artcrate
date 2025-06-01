    // Check specific NFT utility

export const checkNFT = (nftId) => {
    console.log(`\n🔍 Checking NFT #${nftId}...\n`);
    
    // Check in localStorage
    const userNFTs = JSON.parse(localStorage.getItem('userNFTs') || '[]');
    const nft = userNFTs.find(n => n.id === nftId.toString());
    
    if (nft) {
        console.log('✅ Found in userNFTs:');
        console.log('- Title:', nft.title);
        console.log('- Description:', nft.description);
        console.log('- Image:', nft.image);
        console.log('- Creator:', nft.creator);
        console.log('- Owner:', nft.owner);
        console.log('- TokenURI:', nft.tokenURI);
        console.log('- Timestamp:', nft.timestamp);
        
        // Check if image URL has issues
        if (nft.image) {
            const hashMatch = nft.image.match(/Qm[a-zA-Z0-9]+/);
            if (hashMatch) {
                const hash = hashMatch[0];
                console.log(`\n- IPFS Hash: ${hash} (${hash.length} chars)`);
                if (hash.length < 46) {
                    console.warn('⚠️ Hash appears truncated!');
                }
            }
        }
    } else {
        console.log('❌ Not found in userNFTs');
    }
    
    // Check individual storage
    const individualNFT = localStorage.getItem(`nft_${nftId}`);
    if (individualNFT) {
        console.log('\n✅ Found in individual storage:');
        console.log(JSON.parse(individualNFT));
    } else {
        console.log('\n❌ Not found in individual storage');
    }
    
    // Check if hidden
    const hiddenNFTs = JSON.parse(localStorage.getItem('hiddenNFTs') || '[]');
    if (hiddenNFTs.includes(nftId) || hiddenNFTs.includes(nftId.toString())) {
        console.log('\n⚠️ This NFT is currently hidden!');
    }
    
    return nft;
};

// Export to window
if (typeof window !== 'undefined') {
    window.checkNFT = checkNFT;
}