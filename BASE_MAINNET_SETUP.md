# Base Mainnet Deployment Quick Guide

## 🚨 IMPORTANT: This is for PRODUCTION deployment on Base Mainnet

This guide is for deploying to **Base Mainnet** with **real ETH**. Make sure you:
- Have audited your smart contract
- Have tested thoroughly on testnet first
- Understand the risks and costs involved
- Have sufficient ETH for deployment and operations

## 📋 Prerequisites

✅ Node.js installed (v18 or higher)  
✅ ETH on Base Mainnet for deployment (~0.01-0.05 ETH recommended)  
✅ MetaMask or compatible wallet  
✅ Private key secured (NEVER share or commit to git)  

## 🔧 Quick Setup Steps

### 1. Install Dependencies

```bash
cd C:\Users\AFFAN\Desktop\Qoder\volatility-miniapp
npm install
```

### 2. Get ETH on Base Mainnet

**Option A: Bridge from Ethereum**
1. Visit https://bridge.base.org/
2. Connect your wallet
3. Bridge ETH from Ethereum Mainnet to Base Mainnet

**Option B: Buy directly on Base**
- Use Base-supported on-ramps
- Or CEX withdrawal directly to Base

### 3. Deploy Smart Contract

#### Using Hardhat:

1. **Install Hardhat:**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

2. **Create `hardhat.config.js`:**
```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY
    }
  }
};
```

3. **Create `.env` file:**
```bash
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

4. **Create `scripts/deploy.js`:**
```javascript
async function main() {
  // Base Mainnet BTC/USD Price Feed
  const BTC_FEED = "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F";
  
  console.log("Deploying VolatilityPrediction contract to Base Mainnet...");
  
  const VolatilityPrediction = await ethers.getContractFactory("VolatilityPrediction");
  const contract = await VolatilityPrediction.deploy(BTC_FEED);
  
  await contract.deployed();
  
  console.log("✅ Contract deployed to:", contract.address);
  console.log("🔗 View on BaseScan:", `https://basescan.org/address/${contract.address}`);
  console.log("\n⚠️  IMPORTANT: Copy this address to src/config/wagmi.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

5. **Deploy:**
```bash
npx hardhat run scripts/deploy.js --network base
```

6. **Verify on BaseScan (Recommended):**
```bash
npx hardhat verify --network base <DEPLOYED_CONTRACT_ADDRESS> "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F"
```

### 4. Update Frontend Configuration

**Edit `src/config/wagmi.ts`:**
```typescript
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'
```

### 5. Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and test:
- ✅ Wallet connection to Base Mainnet
- ✅ Placing a bet (costs real ETH!)
- ✅ Viewing round info
- ✅ Checking history

### 6. Create Required Images

Create these two images (see IMAGE_REQUIREMENTS.txt for details):

1. **`public/miniapp-preview.png`** - 1200x800px (3:2 ratio)
2. **`public/splash.png`** - 200x200px (square)

### 7. Set Up Farcaster Account Association

Follow the guide at: https://docs.base.org/mini-apps/technical-guides/sign-manifest

Update `public/.well-known/farcaster.json` with your signature.

### 8. Update All URLs

Replace `https://yourdomain.com` in:
- `index.html` (6 locations)
- `public/.well-known/farcaster.json` (3 locations)

### 9. Build for Production

```bash
npm run build
```

Verify the build completes without errors.

### 10. Deploy to Hosting

**Recommended: Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Or: Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Private key is NEVER committed to git
- [ ] Smart contract has been reviewed/audited
- [ ] Contract ownership verified
- [ ] Sufficient ETH in wallet for operations
- [ ] Tested all functionality before public launch
- [ ] Backup of private keys stored securely offline

## 📊 Important Contract Info

**Network:** Base Mainnet  
**Chain ID:** 8453  
**RPC URL:** https://mainnet.base.org  
**Block Explorer:** https://basescan.org/  
**Chainlink BTC/USD Feed:** 0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F  

## 💰 Estimated Costs

**Contract Deployment:** ~0.005-0.01 ETH  
**Round Settlement (per round):** ~0.0001-0.0005 ETH  
**Monthly Operations (60 rounds/day):** ~0.03-0.15 ETH  

*Note: Costs vary based on Base network congestion*

## ⚡ Post-Deployment

### Set Up Automated Round Settlement

**Option 1: Chainlink Automation (Recommended)**
1. Go to https://automation.chain.link/
2. Register new upkeep
3. Select Base Mainnet
4. Add your contract address
5. Set `settleRound()` as the function
6. Set interval to 900 seconds (15 minutes)
7. Fund with LINK tokens

**Option 2: Custom Cron Job**
Create a script that calls `settleRound()` every 15 minutes:
```javascript
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

async function settleRound() {
  const tx = await contract.settleRound();
  await tx.wait();
  console.log("Round settled:", tx.hash);
}

// Run every 15 minutes
setInterval(settleRound, 15 * 60 * 1000);
```

## 🎯 Testing Checklist

Before announcing publicly:

- [ ] Connect wallet to Base Mainnet
- [ ] Place a small test bet (0.000001 ETH)
- [ ] Verify bet appears in live activity
- [ ] Wait for round to end (15 minutes)
- [ ] Settle round as owner
- [ ] Verify winners receive prizes
- [ ] Check new round starts automatically
- [ ] Test with multiple participants
- [ ] Verify Farcaster embed displays correctly
- [ ] Test launching from Farcaster client

## 📱 Add Base Network to MetaMask

If Base Mainnet isn't in your MetaMask:

**Network Name:** Base Mainnet  
**RPC URL:** https://mainnet.base.org  
**Chain ID:** 8453  
**Currency Symbol:** ETH  
**Block Explorer:** https://basescan.org  

Or visit https://chainlist.org/ and search for "Base"

## 🆘 Troubleshooting

**"Insufficient funds for gas"**
- Add more ETH to your wallet on Base Mainnet

**"Contract call reverted"**
- Verify contract address is correct
- Check you're connected to Base Mainnet (not Sepolia)
- Ensure round hasn't already ended

**"Network not supported"**
- Make sure MetaMask is set to Base Mainnet (Chain ID: 8453)

**Farcaster embed not showing**
- Verify `.well-known/farcaster.json` is accessible
- Check all URLs are HTTPS
- Ensure images meet size requirements

## 📞 Support & Resources

**Base:**
- Docs: https://docs.base.org/
- Discord: https://base.org/discord
- Twitter: https://twitter.com/base

**BaseScan:**
- Explorer: https://basescan.org/
- API Docs: https://docs.basescan.org/

**Chainlink:**
- Price Feeds: https://docs.chain.link/data-feeds/price-feeds/addresses?network=base
- Automation: https://docs.chain.link/chainlink-automation/introduction

**Farcaster:**
- MiniApps: https://miniapps.farcaster.xyz/
- Warpcast: https://warpcast.com/

## ⚠️ FINAL WARNINGS

1. **This deploys to MAINNET with REAL MONEY**
2. **Test everything thoroughly first**
3. **Never share your private keys**
4. **Consider a security audit before launch**
5. **Start with small amounts to test**
6. **Have emergency pause functionality ready**
7. **Monitor the contract closely after launch**

---

**Ready to deploy?** Follow the steps above carefully. Good luck! 🚀
