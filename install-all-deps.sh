#!/bin/bash

echo "📦 Installing all required dependencies for Hardhat deployment..."

npm install --save-dev \
  @chainlink/contracts \
  @nomicfoundation/hardhat-ethers \
  @nomicfoundation/hardhat-verify \
  ethers \
  --legacy-peer-deps

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "🚀 Now you can deploy with:"
echo "   npx hardhat run scripts/deploy.js --network base"
