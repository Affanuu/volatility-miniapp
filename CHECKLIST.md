# Pre-Deployment Checklist

Use this checklist to ensure everything is properly configured before deploying your BTC Volatility MiniApp.

## 1. Prerequisites ✓

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn package manager
- [ ] Git installed (for version control)
- [ ] MetaMask or Web3 wallet installed
- [ ] Base Sepolia ETH (for testing) or Base Mainnet ETH

## 2. Project Setup ✓

- [ ] Cloned/downloaded the project
- [ ] Navigated to `volatility-miniapp` directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors
- [ ] No critical security vulnerabilities reported

## 3. Required Images 📸

- [ ] Created `public/miniapp-preview.png`
  - [ ] Dimensions: 3:2 aspect ratio (1200x800 recommended)
  - [ ] File size: Under 10MB
  - [ ] Format: PNG, JPG, WebP, or GIF
  - [ ] Visually appealing and professional
  
- [ ] Created `public/splash.png`
  - [ ] Dimensions: Exactly 200x200 pixels
  - [ ] File size: Under 1MB
  - [ ] Format: PNG preferred
  - [ ] Simple, clean design

## 4. Smart Contract Deployment 📝

- [ ] Installed Hardhat or Foundry
- [ ] Configured network settings (Base Sepolia or Mainnet)
- [ ] Set up private key securely (in .env, not committed)
- [ ] Deployed VolatilityPrediction contract
- [ ] Verified contract on BaseScan (optional but recommended)
- [ ] Noted down deployed contract address: `0x_______________`
- [ ] Confirmed Chainlink price feed address is correct

## 5. Frontend Configuration ⚙️

- [ ] Updated `src/config/wagmi.ts`:
  - [ ] Line 13: `CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS'`
  - [ ] Verified network configuration (Base/Base Sepolia)
  - [ ] Chainlink price feed address is correct

## 6. Farcaster Integration 🎯

- [ ] Generated Farcaster account association signature
- [ ] Updated `public/.well-known/farcaster.json`:
  - [ ] Lines 3-7: Added account association (header, payload, signature)
  - [ ] Line 10: Updated imageUrl with your domain
  - [ ] Line 16: Updated url with your domain
  - [ ] Line 17: Updated splashImageUrl with your domain

- [ ] Updated `index.html`:
  - [ ] Line 12: imageUrl points to your domain
  - [ ] Line 18: url points to your domain
  - [ ] Line 19: splashImageUrl points to your domain
  - [ ] Lines 28-29: og:image and og:url updated
  - [ ] Line 35: twitter:image updated

## 7. Environment Variables 🔐

- [ ] Created `.env` file (from `.env.example`)
- [ ] Added all required variables:
  - [ ] `VITE_BASE_MAINNET_RPC` or `VITE_BASE_SEPOLIA_RPC`
  - [ ] `VITE_CONTRACT_ADDRESS`
  - [ ] `VITE_APP_URL`
- [ ] Ensured `.env` is in `.gitignore`
- [ ] Never committed private keys to Git

## 8. Local Testing 🧪

- [ ] Ran `npm run dev` successfully
- [ ] App opens at http://localhost:3000
- [ ] No console errors in browser
- [ ] Wallet connection works
- [ ] Can switch to correct network (Base Sepolia/Mainnet)
- [ ] Current round displays correctly
- [ ] Timer counts down properly
- [ ] Can place bet (MORE/LESS)
- [ ] Transaction confirms successfully
- [ ] Bet appears in live activity
- [ ] History tab loads without errors
- [ ] All images load correctly
- [ ] UI is responsive (test 424x695 window size)

## 9. Production Build 🏗️

- [ ] Ran `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No build warnings (or acceptable ones only)
- [ ] Ran `npm run preview` to test production build
- [ ] Verified all features work in production build

## 10. Deployment 🚀

### Choose your deployment platform:

**Option A: Vercel**
- [ ] Connected GitHub repository to Vercel
- [ ] Configured build settings (auto-detected)
- [ ] Added environment variables in Vercel dashboard
- [ ] Deployed successfully
- [ ] Custom domain configured (if applicable)

**Option B: Netlify**
- [ ] Connected GitHub repository to Netlify
- [ ] Configured build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Added environment variables
- [ ] Deployed successfully
- [ ] Custom domain configured (if applicable)

**Option C: Custom Server**
- [ ] Built project: `npm run build`
- [ ] Uploaded `dist/` folder to server
- [ ] Configured web server (nginx/Apache)
- [ ] Ensured `.well-known/` directory is accessible
- [ ] HTTPS certificate installed
- [ ] DNS records configured

## 11. Post-Deployment Verification ✅

- [ ] Visited production URL: `https://yourdomain.com`
- [ ] App loads without errors
- [ ] Wallet connection works in production
- [ ] Can place real bets
- [ ] Images display correctly
- [ ] Checked `https://yourdomain.com/.well-known/farcaster.json`:
  - [ ] Returns valid JSON
  - [ ] No 404 errors
  - [ ] Accessible via HTTPS

## 12. Farcaster Testing 🎭

- [ ] Shared production URL in Farcaster cast
- [ ] Embed displays correctly with preview image
- [ ] Preview image shows (3:2 ratio)
- [ ] "Play Now" button appears
- [ ] Clicking button launches miniapp
- [ ] Miniapp loads in Farcaster client
- [ ] Splash screen displays during loading
- [ ] Full functionality works within Farcaster

## 13. Smart Contract Operations 🎮

**Owner Tasks:**
- [ ] Tested settling a round manually
- [ ] Verified prize distribution works correctly
- [ ] Confirmed new round starts after settlement
- [ ] Tested pause/unpause betting (if needed)

**Optional Automation:**
- [ ] Set up Chainlink Automation for auto-settlement
- [ ] Configured cron job for round settlement
- [ ] Tested automated settlement

## 14. Security Review 🔒

- [ ] Private keys never committed to Git
- [ ] `.env` is in `.gitignore`
- [ ] Contract ownership verified
- [ ] No exposed admin endpoints
- [ ] CORS configured properly
- [ ] Rate limiting considered (if applicable)
- [ ] Contract audited (recommended for mainnet)

## 15. Documentation 📚

- [ ] README.md updated with:
  - [ ] Correct contract address
  - [ ] Deployment URL
  - [ ] Any custom configuration
- [ ] Screenshots added (optional)
- [ ] License information confirmed
- [ ] Contribution guidelines (if open source)

## 16. Monitoring & Maintenance 📊

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (optional)
- [ ] Monitor contract on BaseScan
- [ ] Set up alerts for contract events
- [ ] Plan for regular round settlement
- [ ] Document backup procedures

## Final Pre-Launch Checklist 🎉

- [ ] All previous sections completed
- [ ] Tested full user journey end-to-end
- [ ] Verified on multiple devices (desktop, mobile)
- [ ] Checked on different browsers (Chrome, Firefox, Safari)
- [ ] Confirmed with test users (if possible)
- [ ] Marketing materials ready (optional)
- [ ] Social media posts prepared (optional)
- [ ] Community announcement ready (optional)

## Launch Day! 🚀

- [ ] Announced on Farcaster
- [ ] Shared on Base community channels
- [ ] Monitored for issues
- [ ] Responded to user feedback
- [ ] Tracked analytics/usage
- [ ] Celebrated! 🎊

---

## Troubleshooting Common Issues

### Images not showing
- Verify files exist in `public/` folder
- Check file paths are correct (case-sensitive on some servers)
- Ensure images are publicly accessible via HTTPS
- Verify aspect ratios and dimensions

### Contract calls failing
- Confirm contract address is correct
- Check you're on the right network
- Ensure wallet has enough ETH for gas
- Verify contract ABI matches deployed contract

### Farcaster embed broken
- Validate `farcaster.json` is accessible
- Check account association is signed correctly
- Ensure all URLs use HTTPS (not HTTP)
- Verify image URLs are absolute (not relative)

### Build errors
- Run `npm install` again
- Clear `node_modules` and reinstall
- Check TypeScript version compatibility
- Review error messages for specific issues

---

**Note:** This checklist is comprehensive. Not all items may apply to your specific deployment scenario. Use your judgment and refer to the detailed guides (DEPLOYMENT.md, SETUP_INSTRUCTIONS.md) for more information.

**Ready to deploy?** Once you've checked all applicable boxes, you're good to go! 🚀
