async function main() {
  // Base Mainnet BTC/USD Chainlink Price Feed
  const BTC_FEED = "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F";
  
  console.log("\n🚀 Deploying VolatilityPrediction contract to Base Mainnet...");
  console.log("📊 Using Chainlink BTC/USD Feed:", BTC_FEED);
  
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
  
  const VolatilityPrediction = await ethers.getContractFactory("VolatilityPrediction");
  console.log("📝 Deploying contract...");
  
  const contract = await VolatilityPrediction.deploy(BTC_FEED);
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 View on BaseScan: https://basescan.org/address/" + contractAddress);
  console.log("\n⚠️  IMPORTANT: Copy this address to src/config/wagmi.ts");
  console.log("\n📋 To verify on BaseScan, run:");
  console.log(`npx hardhat verify --network base ${contractAddress} "${BTC_FEED}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
