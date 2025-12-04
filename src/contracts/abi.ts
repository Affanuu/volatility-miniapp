export const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "_priceFeed", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "bettor", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "predictMoreVolatile", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "winner", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "PrizeDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "volatilityPercent", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "moreVolatileWon", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "totalPot", "type": "uint256"}
    ],
    "name": "RoundSettled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"indexed": false, "internalType": "int256", "name": "startPrice", "type": "int256"}
    ],
    "name": "RoundStarted",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "bool", "name": "predictMoreVolatile", "type": "bool"}],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentRoundInfo",
    "outputs": [
      {"internalType": "uint256", "name": "roundId", "type": "uint256"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "int256", "name": "startPrice", "type": "int256"},
      {"internalType": "uint256", "name": "totalPot", "type": "uint256"},
      {"internalType": "uint256", "name": "moreBets", "type": "uint256"},
      {"internalType": "uint256", "name": "lessBets", "type": "uint256"},
      {"internalType": "bool", "name": "bettingOpen", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "roundId", "type": "uint256"}],
    "name": "getRoundBets",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "bettor", "type": "address"},
          {"internalType": "bool", "name": "predictMoreVolatile", "type": "bool"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "internalType": "struct VolatilityPrediction.Bet[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "roundId", "type": "uint256"}],
    "name": "getRoundDetails",
    "outputs": [
      {"internalType": "uint256", "name": "volatilityPercent", "type": "uint256"},
      {"internalType": "bool", "name": "moreVolatileWon", "type": "bool"},
      {"internalType": "uint256", "name": "totalPot", "type": "uint256"},
      {"internalType": "bool", "name": "settled", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentBTCPrice",
    "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "settleRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentRoundId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "previousVolatility",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_newFee", "type": "uint256"}],
    "name": "updateEntryFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bool", "name": "_pause", "type": "bool"}],
    "name": "pauseBetting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const
