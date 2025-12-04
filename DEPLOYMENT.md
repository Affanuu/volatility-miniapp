# Deployment Guide for BTC Volatility MiniApp

## Step 1: Prepare Images

### Preview Image (3:2 Aspect Ratio)
- Create a 1200x800px PNG image showcasing your app
- Should include branding, game preview, or call-to-action
- Save as `public/miniapp-preview.png`
- Maximum file size: 10MB

### Splash Screen (200x200px)
- Create a 200x200px square PNG for the loading screen
- Simple logo or branding works best
- Save as `public/splash.png`
- Maximum file size: 1MB

## Step 2: Deploy Smart Contract

### Using Hardhat

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    }
  }
};
```

3. Create deployment script `scripts/deploy.js`:
```javascript
async function main() {
  const BTC_FEED = "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F"; // Base Mainnet BTC/USD
  
  const VolatilityPrediction = await ethers.getContractFactory("VolatilityPrediction");
  const contract = await VolatilityPrediction.deploy(BTC_FEED);
  
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Deploy:
```bash
npx hardhat run scripts/deploy.js --network base
```

5. **IMPORTANT**: Copy the deployed contract address to `src/config/wagmi.ts`

### Using Foundry (Alternative)

1. Install Foundry: https://book.getfoundry.sh/getting-started/installation

2. Install dependencies:
```bash
forge install smartcontractkit/chainlink-brownie-contracts
```

3. Deploy:
```bash
forge create contracts/VolatilityPrediction.sol:VolatilityPrediction \
  --constructor-args 0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F \
  --rpc-url https://mainnet.base.org \
  --private-key YOUR_PRIVATE_KEY
```

## Step 3: Configure Frontend

1. Update `src/config/wagmi.ts`:
```typescript
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'
```

2. Create `.env`:
```bash
cp .env.example .env
# Edit .env with your values
```

## Step 4: Set Up Farcaster Account Association

### Option A: Using Neynar SDK

1. Install Neynar SDK:
```bash
npm install @neynar/nodejs-sdk
```

2. Generate signature:
```javascript
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient("YOUR_NEYNAR_API_KEY");
const signature = await client.publishMiniApp({
  name: "BTC Volatility",
  url: "https://yourdomain.com"
});

console.log(signature);
```

### Option B: Using Base CLI

Follow the official guide:
https://docs.base.org/mini-apps/technical-guides/sign-manifest

### Option C: Manual Process

1. Install dependencies:
```bash
npm install @farcaster/core viem
```

2. Run account association script (create your own or use Farcaster tools)

3. Update `public/.well-known/farcaster.json` with the generated:
   - `header`
   - `payload`
   - `signature`

## Step 5: Update URLs

Replace `https://yourdomain.com` in these files:

1. `index.html`:
   - Line 12: `imageUrl`
   - Line 18: `url`
   - Line 19: `splashImageUrl`
   - Line 28: `og:image`
   - Line 29: `og:url`
   - Line 35: `twitter:image`

2. `public/.well-known/farcaster.json`:
   - Line 10: `imageUrl`
   - Line 16: `url`
   - Line 17: `splashImageUrl`

## Step 6: Build & Test Locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and test:
- Wallet connection
- Betting functionality
- Round timer
- Live volatility tracker
- History page

## Step 7: Deploy to Production

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
npm run build
vercel --prod
```

3. Or connect your GitHub repo to Vercel dashboard

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Custom Server

1. Build:
```bash
npm run build
```

2. Upload `dist/` folder to your server

3. Configure nginx/Apache to serve the static files

4. Ensure `.well-known/farcaster.json` is accessible

## Step 8: Verify Farcaster Integration

1. Check manifest is accessible:
```bash
curl https://yourdomain.com/.well-known/farcaster.json
```

2. Verify images load:
   - https://yourdomain.com/miniapp-preview.png (should be 3:2 ratio)
   - https://yourdomain.com/splash.png (should be 200x200)

3. Test in Farcaster:
   - Share your URL in a Farcaster cast
   - Verify the embed shows correctly
   - Click to launch and test the miniapp

## Step 9: Contract Management

### Start First Round

The first round starts automatically on deployment.

### Settle Rounds (Owner Only)

After 15 minutes:
```javascript
// Using ethers.js
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
await contract.settleRound();
```

### Automate Round Settlement

Consider using:
- Chainlink Automation (recommended)
- Gelato Network
- Custom cron job calling `settleRound()`

Example Chainlink Automation setup:
1. Go to https://automation.chain.link/
2. Register new upkeep
3. Set contract address and `settleRound()` function
4. Set time interval to 15 minutes (900 seconds)

## Troubleshooting

### Images Not Loading
- Verify files exist in `public/` folder
- Check CORS headers on your server
- Ensure correct aspect ratios

### Contract Calls Failing
- Verify contract address in `wagmi.ts`
- Check you're on correct network (Base Mainnet)
- Ensure wallet has enough ETH for gas fees

### Farcaster Embed Not Showing
- Verify `farcaster.json` is accessible
- Check account association signature is valid
- Ensure all URLs are HTTPS

### Timer Not Working
- Check round hasn't already ended
- Verify contract is deployed and accessible

## Post-Deployment Checklist

- [ ] Smart contract deployed and verified on BaseScan
- [ ] Contract address updated in frontend
- [ ] Images uploaded (preview 3:2, splash 200x200)
- [ ] All URLs updated to production domain
- [ ] Farcaster account association completed
- [ ] `.well-known/farcaster.json` accessible
- [ ] Frontend deployed and accessible via HTTPS
- [ ] Tested wallet connection
- [ ] Tested placing bets
- [ ] Tested round settlement (as owner)
- [ ] Verified Farcaster embed displays correctly
- [ ] Set up automated round settlement (recommended)

## Security Notes

- Never commit `.env` file with private keys
- Use a dedicated wallet for contract owner operations
- Consider multi-sig for contract ownership
- **IMPORTANT**: Audit smart contract before mainnet deployment
- Ensure you have sufficient ETH on Base Mainnet for deployment and operations
- Double-check all contract parameters before deploying to mainnet

## Support Resources

- Base Docs: https://docs.base.org/
- Farcaster MiniApps: https://miniapps.farcaster.xyz/
- Chainlink Feeds: https://docs.chain.link/data-feeds
- Wagmi Docs: https://wagmi.sh/
