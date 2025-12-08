import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
})

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESS = '0xf82c0E1d2C5474474E083cEE08f0D003cA5c949E' // Deployed on Base Mainnet

// Chainlink BTC/USD Price Feed on Base Mainnet
export const BTC_PRICE_FEED = '0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F'
