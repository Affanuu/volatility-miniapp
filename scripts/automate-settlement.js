// Script to automate round settlement every 15 minutes
// Run this with: npm run automate

import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Load environment variables
dotenv.config();
const CONTRACT_ADDRESS = '0x3f3437d99Eb832B18410FB5E676D3ce2Df8Ddd1a';
const RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

// Contract ABI (just the settleRound function)
const CONTRACT_ABI = [
  "function settleRound() public",
  "function currentRoundId() public view returns (uint256)"
];

async function automateSettlement() {
  if (!PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY not found in .env file');
    process.exit(1);
  }

  // Initialize Neynar client if API key is provided
  let neynarClient = null;
  if (NEYNAR_API_KEY) {
    try {
      neynarClient = new NeynarAPIClient({ apiKey: NEYNAR_API_KEY });
      console.log('🐦 Neynar client initialized');
    } catch (error) {
      console.log('⚠️  Failed to initialize Neynar client:', error.message);
    }
  }

  // Connect to Base Mainnet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  console.log('🤖 Starting automated round settlement...');
  console.log('📍 Contract:', CONTRACT_ADDRESS);
  console.log('👤 Account:', wallet.address);
  console.log('⏰ Settling rounds every 15 minutes (900 seconds)');
  if (neynarClient) {
    console.log('📢 Notifications enabled via Neynar');
  }
  console.log();

  // Initial check
  await settleRoundIfNeeded(contract, neynarClient);

  // Set up interval (every 15 minutes)
  setInterval(async () => {
    await settleRoundIfNeeded(contract, neynarClient);
  }, 15 * 60 * 1000); // 15 minutes in milliseconds
}

async function settleRoundIfNeeded(contract, neynarClient = null) {
  try {
    console.log(`⏱️  [${new Date().toISOString()}] Checking if round needs settlement...`);

    // Get current round ID
    const roundId = await contract.currentRoundId();
    console.log(`📊 Current round ID: ${roundId.toString()}`);

    // Attempt to settle the round
    console.log('🔧 Settling round...');
    const tx = await contract.settleRound();
    console.log('📡 Transaction sent:', tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('✅ Round settled successfully!');
    console.log('🔗 Transaction:', `https://basescan.org/tx/${tx.hash}\n`);

    // Send notification via Neynar if available
    if (neynarClient) {
      try {
        const message = `🎲 BTC Volatility Round #${roundId.toString()} has been settled!\n\nTransaction: https://basescan.org/tx/${tx.hash}`;
        console.log('📢 Sending notification via Neynar...');
        // Uncomment the following lines if you want to post to a specific channel
        // await neynarClient.publishCast(YOUR_FID, message);
        console.log('✅ Notification sent!');
      } catch (notifyError) {
        console.log('⚠️  Failed to send notification:', notifyError.message);
      }
    }
  } catch (error) {
    if (error.message.includes('Round not ended')) {
      console.log('ℹ️  Round not yet ended, skipping...\n');
    } else if (error.message.includes('Already settled')) {
      console.log('ℹ️  Round already settled, skipping...\n');
    } else {
      console.error('❌ Error settling round:', error.message);
      console.log('⚠️  Continuing automation...\n');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down automation...');
  process.exit(0);
});

// Start automation
automateSettlement().catch(console.error);