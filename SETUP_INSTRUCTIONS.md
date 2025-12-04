# Quick Setup Instructions

## Prerequisites

You need Node.js installed on your system. If you don't have it:

**Windows:**
1. Download from https://nodejs.org/
2. Install the LTS version
3. Restart your terminal

**Mac/Linux:**
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

## Step 1: Install Dependencies

```bash
cd volatility-miniapp
npm install
```

This will install:
- React & React DOM
- Vite (build tool)
- TypeScript
- Wagmi & Viem (Web3 libraries)
- TanStack Query

## Step 2: Create Images

Create two images and place them in the `public/` folder:

1. **miniapp-preview.png**: 1200x800px (3:2 ratio)
   - This is what users see when your miniapp is shared
   - Should showcase your app or have a call-to-action

2. **splash.png**: 200x200px (square)
   - Loading screen when miniapp launches
   - Keep it simple (logo/branding)

## Step 3: Deploy Smart Contract

You have two options:

### Option A: Use an existing deployment
If someone already deployed the contract, just update `src/config/wagmi.ts` with the contract address.

### Option B: Deploy yourself

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

2. Copy the contract from `contracts/VolatilityPrediction.sol`

3. Deploy to Base Mainnet:
```bash
npx hardhat run scripts/deploy.js --network base
```

4. Copy the deployed address to `src/config/wagmi.ts`:
```typescript
export const CONTRACT_ADDRESS = '0xYOUR_ADDRESS_HERE'
```

## Step 4: Get Base Mainnet ETH

To deploy and use the app on Base Mainnet, you need real ETH:

1. Get ETH on Ethereum Mainnet (buy from exchanges like Coinbase, Binance, etc.)
2. Bridge to Base Mainnet using https://bridge.base.org/
3. Or buy directly on Base through on-ramps

## Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Step 6: Test the App

1. Connect your MetaMask wallet
2. Switch to Base Mainnet network
3. Place a bet (0.000001 ETH)
4. Wait for round to complete (15 minutes)
5. Owner settles the round using `settleRound()`

## Step 7: Set Up Farcaster Integration

### A. Account Association

You need to link your app to a Farcaster account:

1. Visit https://docs.base.org/mini-apps/technical-guides/sign-manifest
2. Follow the guide to generate signature
3. Update `public/.well-known/farcaster.json` with your signature

### B. Update URLs

Replace all instances of `https://yourdomain.com` with your actual domain in:
- `index.html`
- `public/.well-known/farcaster.json`

## Step 8: Deploy to Production

### Vercel (Easiest)

1. Push code to GitHub
2. Go to https://vercel.com/
3. Import your repository
4. Vercel auto-detects Vite and deploys!

### Alternative: Netlify

1. Push code to GitHub
2. Go to https://netlify.com/
3. Import your repository
4. Deploy!

## Post-Deployment Checklist

After deploying:

- [ ] Visit `https://yourdomain.com/.well-known/farcaster.json` - should return JSON
- [ ] Check images load: `/miniapp-preview.png` and `/splash.png`
- [ ] Test wallet connection on production site
- [ ] Share URL in Farcaster to see the embed
- [ ] Test launching miniapp from Farcaster

## Common Issues

### "npm: command not found"
- Node.js is not installed. Install from https://nodejs.org/

### "Cannot connect wallet"
- Make sure you're on Base Mainnet network in MetaMask
- Check contract address is correct in `wagmi.ts`

### "Transaction reverted"
- Ensure you have enough ETH on Base Mainnet
- Check the entry fee is exactly 0.000001 ETH
- Verify round hasn't ended

### Farcaster embed not showing
- Verify account association in `farcaster.json`
- Check all URLs are HTTPS (not HTTP)
- Ensure images are correct dimensions

## Next Steps

1. **Automate Round Settlement**: Use Chainlink Automation or cron job
2. **Add Wallet Connect**: Support more wallets
3. **Enhance UI**: Add animations, better mobile support
4. **Add Analytics**: Track user behavior
5. **Monitor Performance**: Track gas costs and optimize

## Resources

- Base Docs: https://docs.base.org/
- Farcaster MiniApps: https://miniapps.farcaster.xyz/
- Wagmi: https://wagmi.sh/
- Viem: https://viem.sh/

## Need Help?

Check the full `DEPLOYMENT.md` for detailed instructions on each step.
