# BTC Volatility Prediction MiniApp

A decentralized volatility prediction game built on Base where users predict whether BTC will be MORE or LESS volatile compared to the previous round.

## Features

- **15-Minute Rounds**: Each round lasts exactly 15 minutes
- **Simple Betting**: Just 0.000001 ETH per bet (MORE or LESS volatile)
- **Live Tracking**: Real-time volatility calculation and BTC price updates
- **Fair Distribution**: 90% to winners, 10% to protocol
- **Chainlink Integration**: Trusted BTC price feeds from Chainlink oracles
- **Farcaster MiniApp**: Optimized for Farcaster with proper embed metadata

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Lexend font, custom CSS with Base brand colors
- **Web3**: Wagmi + Viem for Base network interaction
- **Smart Contract**: Solidity 0.8.20 with Chainlink Price Feeds
- **MiniApp**: Farcaster MiniApp specifications (424x695 web dimensions)

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Base Sepolia or Base Mainnet ETH

### Installation

```bash
cd volatility-miniapp
npm install
```

### Development

```bash
npm run dev
```

App will be available at http://localhost:3000

### Build

```bash
npm run build
npm run preview
```

## Smart Contract Deployment

1. Install Hardhat or Foundry
2. Update `.env` with your private key and RPC URL
3. Deploy to Base Sepolia:

```bash
# Using Hardhat
npx hardhat run scripts/deploy.js --network baseSepolia

# Using Foundry
forge create contracts/VolatilityPrediction.sol:VolatilityPrediction \
  --constructor-args 0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1 \
  --rpc-url $BASE_SEPOLIA_RPC \
  --private-key $PRIVATE_KEY
```

4. Update `src/config/wagmi.ts` with deployed contract address

## Chainlink Price Feeds

- **Base Mainnet**: `0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F`
- **Base Sepolia**: `0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1`

## Farcaster MiniApp Setup

### 1. Create Preview Image

Create a preview image with **3:2 aspect ratio** (recommended: 1200x800px):
- Save as `public/miniapp-preview.png`
- Max size: 10MB
- Format: PNG, JPG, WebP, or GIF

### 2. Create Splash Image

Create a splash screen image **200x200px**:
- Save as `public/splash.png`
- Max size: 1MB
- Square format

### 3. Configure Account Association

Generate your Farcaster account association signature:

```bash
# Using Farcaster SDK or Neynar
# Follow: https://docs.base.org/mini-apps/technical-guides/sign-manifest
```

Update `public/.well-known/farcaster.json` with your:
- `header`
- `payload`
- `signature`

### 4. Update URLs

Replace `https://yourdomain.com` in:
- `index.html` (fc:miniapp meta tag)
- `public/.well-known/farcaster.json`

### 5. Deploy

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Deploy dist/ folder
```

### 6. Verify MiniApp

- Ensure `/.well-known/farcaster.json` is accessible
- Verify embed image loads (3:2 ratio)
- Test in Farcaster client

## Configuration

### Contract Address

Update in `src/config/wagmi.ts`:

```typescript
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress'
```

### Network

Currently configured for Base and Base Sepolia. To add more networks, edit `src/config/wagmi.ts`.

## Game Rules

1. **Entry**: 0.000001 ETH per bet
2. **Duration**: 15 minutes per round
3. **Choices**: MORE volatile or LESS volatile than previous round
4. **Calculation**: Volatility = |end_price - start_price| / start_price × 100%
5. **Distribution**:
   - 90% split among winners (proportional to bet count)
   - 10% to protocol owner
   - Full refund if only 1 participant or first round

## MiniApp Specifications

### Display Dimensions
- **Web**: 424px × 695px
- **Mobile**: Full device dimensions

### Image Requirements
- **Preview**: 3:2 ratio, 600x400px to 3000x2000px, <10MB
- **Splash**: 200x200px, <1MB

### Metadata
- `fc:miniapp` meta tag with JSON configuration
- Open Graph tags for social sharing
- Account association via `.well-known/farcaster.json`

## Project Structure

```
volatility-miniapp/
├── contracts/
│   └── VolatilityPrediction.sol    # Main game contract
├── public/
│   ├── .well-known/
│   │   └── farcaster.json          # Farcaster manifest
│   ├── miniapp-preview.png         # 3:2 preview image
│   └── splash.png                  # 200x200 splash
├── src/
│   ├── components/
│   │   ├── CurrentRound.tsx        # Live round UI
│   │   ├── CurrentRound.css
│   │   ├── RoundHistory.tsx        # Past rounds
│   │   └── RoundHistory.css
│   ├── config/
│   │   └── wagmi.ts                # Web3 configuration
│   ├── contracts/
│   │   └── abi.ts                  # Contract ABI
│   ├── App.tsx                     # Main app
│   ├── App.css
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML with metadata
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Support

For issues or questions:
- Smart Contract: Check contract on BaseScan
- Frontend: Check browser console
- Farcaster: Verify manifest at `/.well-known/farcaster.json`

## License

MIT
// Trigger rebuild
