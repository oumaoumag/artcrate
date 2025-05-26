#!/bin/bash

# Simple ArtPlatform Contract Deployment Script (without verification)
# This script deploys the ArtPlatform contract to Lisk Sepolia testnet

set -e  # Exit on any error

echo "🚀 Starting ArtPlatform Contract Deployment (Simple)..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please copy .env.example to .env and fill in your private key:"
    echo "   cp .env.example .env"
    echo "   # Then edit .env with your private key"
    exit 1
fi

# Load environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" = "your_private_key_here" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env file!"
    echo "📝 Please set your private key in the .env file"
    exit 1
fi

echo "🔧 Building contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

echo "🌐 Deploying to Lisk Sepolia..."
echo "📡 RPC URL: $LISK_SEPOLIA_RPC_URL"

# Deploy the contract (without verification for speed)
forge script script/DeployArtPlatform.s.sol:DeployArtPlatform \
    --rpc-url $LISK_SEPOLIA_RPC_URL \
    --broadcast \
    -vvvv

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "📄 Check the deployment details in ./deployments/lisk-sepolia.json"
    echo "🔍 You can view your contract on Lisk Sepolia Explorer:"
    echo "   https://sepolia-blockscout.lisk.com/"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the contract address from the deployment output"
    echo "2. Update frontend/src/config/contracts.js with the new address"
    echo "3. Test the contract interaction in the frontend"
    echo ""
    echo "💡 To verify the contract later, run:"
    echo "   forge verify-contract <CONTRACT_ADDRESS> src/ArtPlatform.sol:ArtPlatform --chain lisk_sepolia"
else
    echo "❌ Deployment failed!"
    exit 1
fi
