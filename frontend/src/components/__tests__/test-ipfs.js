// Test script to verify IPFS functionality
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// Your Pinata credentials from .env
const PINATA_API_KEY = 'f66eeff6ca8630399a1f';
const PINATA_SECRET_KEY = '6a50e5fe6aa48d63f29c23e9e8b4e55b63ae906e6ad89f4bf585dd59fda74d90';

async function testIPFSUpload() {
    console.log('🧪 Testing IPFS Upload Functionality...\n');

    // Test 1: Upload a test image
    console.log('📤 Test 1: Uploading test image to IPFS...');
    try {
        // Create a simple test image (1x1 pixel PNG)
        const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        const testImageBuffer = Buffer.from(testImageBase64, 'base64');
        
        const formData = new FormData();
        formData.append('file', testImageBuffer, {
            filename: 'test-image.png',
            contentType: 'image/png'
        });

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
                ...formData.getHeaders()
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${error}`);
        }

        const data = await response.json();
        console.log('✅ Image uploaded successfully!');
        console.log(`   IPFS Hash: ${data.IpfsHash}`);
        console.log(`   View at: https://ipfs.io/ipfs/${data.IpfsHash}`);
        console.log(`   Pinata Gateway: https://gateway.pinata.cloud/ipfs/${data.IpfsHash}\n`);

        // Test 2: Upload metadata
        console.log('📤 Test 2: Uploading metadata to IPFS...');
        const metadata = {
            name: "Test NFT",
            description: "This is a test NFT to verify IPFS functionality",
            image: `https://ipfs.io/ipfs/${data.IpfsHash}`,
            attributes: [
                {
                    trait_type: "Test",
                    value: "true"
                },
                {
                    trait_type: "Created",
                    value: new Date().toISOString()
                }
            ]
        };

        const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
            },
            body: JSON.stringify(metadata)
        });

        if (!metadataResponse.ok) {
            const error = await metadataResponse.text();
            throw new Error(`Metadata upload failed: ${metadataResponse.status} - ${error}`);
        }

        const metadataData = await metadataResponse.json();
        console.log('✅ Metadata uploaded successfully!');
        console.log(`   IPFS Hash: ${metadataData.IpfsHash}`);
        console.log(`   View at: https://ipfs.io/ipfs/${metadataData.IpfsHash}`);
        console.log(`   Pinata Gateway: https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}\n`);

        // Test 3: Fetch the metadata back
        console.log('📥 Test 3: Fetching metadata from IPFS...');
        const fetchResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`);
        
        if (!fetchResponse.ok) {
            throw new Error(`Failed to fetch metadata: ${fetchResponse.status}`);
        }

        const fetchedMetadata = await fetchResponse.json();
        console.log('✅ Metadata fetched successfully!');
        console.log('   Content:', JSON.stringify(fetchedMetadata, null, 2));

        console.log('\n🎉 All tests passed! Your IPFS configuration is working correctly.');
        console.log('\n📝 Summary:');
        console.log('   - Images are being uploaded to IPFS ✅');
        console.log('   - Metadata is being uploaded to IPFS ✅');
        console.log('   - Content is accessible via IPFS gateways ✅');
        console.log('   - Anyone with the IPFS hash can access your NFTs ✅');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('   1. Check if your Pinata API keys are valid');
        console.log('   2. Ensure you have not exceeded your Pinata usage limits');
        console.log('   3. Try regenerating your API keys from Pinata dashboard');
    }
}

// Run the test
testIPFSUpload();