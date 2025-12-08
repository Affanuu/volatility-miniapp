import { useState, useEffect, useRef } from 'react'
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent, useSwitchChain } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { base } from 'wagmi/chains'
import { CONTRACT_ADDRESS } from '../config/wagmi'
import { contractABI } from '../contracts/abi'
import './CurrentRound.css'

interface Bet {
  bettor: string
  predictMoreVolatile: boolean
  timestamp: bigint
}

function CurrentRound() {
  const { isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { writeContract, isPending } = useWriteContract()
  const [selectedPrediction, setSelectedPrediction] = useState<'HIGH' | 'LOW' | null>(null)
  const [currentVolatility, setCurrentVolatility] = useState<number>(0)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  // Read current round info
  const { data: roundInfo, refetch: refetchRoundInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'getCurrentRoundInfo',
  })

  // Read current BTC price
  const { data: currentPrice } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'getCurrentBTCPrice',
  })

  // Read round bets
  const { data: bets, refetch: refetchBets } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'getRoundBets',
    args: roundInfo ? [roundInfo[0]] : [0n],
  })

  // Watch for bet events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    eventName: 'BetPlaced',
    onLogs() {
      refetchRoundInfo()
      refetchBets()
    },
  })

  // Calculate live volatility
  useEffect(() => {
    if (roundInfo && currentPrice) {
      const [, , , startPrice] = roundInfo
      const priceChange = currentPrice > startPrice 
        ? Number(currentPrice - startPrice) 
        : Number(startPrice - currentPrice)
      const volatility = (priceChange * 10000) / Number(startPrice)
      setCurrentVolatility(volatility / 100) // Convert to percentage
    }
  }, [roundInfo, currentPrice])

  // Ref to store current roundInfo for timer
  const roundInfoRef = useRef(roundInfo);
  
  // Update ref when roundInfo changes
  useEffect(() => {
    roundInfoRef.current = roundInfo;
  }, [roundInfo]);

  // Update timer
  useEffect(() => {
    if (!roundInfo) return;

    const interval = setInterval(() => {
      // Use ref to get current roundInfo
      const currentRoundInfo = roundInfoRef.current;
      if (!currentRoundInfo) return;
      
      const [, , endTime] = currentRoundInfo;
      const now = BigInt(Math.floor(Date.now() / 1000));
      const remaining = Number(endTime - now);

      if (remaining <= 0) {
        setTimeRemaining('Round Ended');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roundInfo]); // Only recreate interval when roundInfo changes

  const handlePlaceBet = async (prediction: 'HIGH' | 'LOW') => {
    console.log('Attempting to place bet:', prediction);
    console.log('Round info available:', !!roundInfo);
    
    if (!roundInfo) return

    // Check if we're on the correct network (Base)
    if (chain?.id !== base.id) {
      try {
        console.log('Switching to Base network...');
        await switchChain({ chainId: base.id });
        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Failed to switch network:', error);
        alert('Please manually switch to Base network in your wallet');
        return;
      }
    }

    try {
      const [, , , , , , , bettingOpen] = roundInfo
      console.log('Betting open status:', bettingOpen);
      
      if (!bettingOpen) {
        alert('Betting is closed for this round')
        return
      }

      console.log('Sending transaction...');
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'placeBet',
        args: [prediction === 'HIGH'],
        value: parseEther('0.000001'),
      })

      setSelectedPrediction(null)
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('Error placing bet: ' + (error as Error).message)
    }
  }

  if (!isConnected) {
    return (
      <div className="current-round">
        <div className="connect-prompt">
          <h3>Connect Wallet to Play</h3>
          <p>Connect your wallet to start predicting BTC volatility</p>
        </div>
      </div>
    )
  }

  if (!roundInfo) {
    return <div className="current-round loading">Loading round data...</div>
  }

  const [roundId, , , , totalPot, moreBets, lessBets, bettingOpen] = roundInfo

  // Debugging - log button states
  console.log('Button states:', { bettingOpen, isPending, disabled: !bettingOpen || isPending });

  return (
    <div className="current-round">
      {/* Round Info */}
      <div className="round-header">
        <div className="round-id">Round #{roundId.toString()}</div>
        <div className="timer">{timeRemaining}</div>
      </div>

      {/* Live Volatility Tracker */}
      <div className="volatility-tracker">
        <div className="tracker-label">Current Volatility</div>
        <div className="tracker-value">{currentVolatility.toFixed(2)}%</div>
        <div className="tracker-hint">
          Previous: {roundInfo ? '0.00%' : 'N/A'}
        </div>
      </div>

      {/* Betting Section */}
      <div className="betting-section">
        <h3>Predict BTC Price Movement</h3>
        <p className="entry-fee">Entry: 0.000001 ETH per prediction</p>
        
        <div className="bet-buttons">
          <button
            className={`bet-btn more ${selectedPrediction === 'HIGH' ? 'selected' : ''}`}
            onClick={() => {
              console.log('HIGH button clicked');
              setSelectedPrediction('HIGH');
            }}
            disabled={!bettingOpen || isPending}
            title={!bettingOpen ? 'Betting is closed for this round' : isPending ? 'Transaction in progress' : 'Predict BTC price will go HIGH'}
          >
            <div className="bet-label">HIGH</div>
            <div className="bet-count">{moreBets.toString()} bets</div>
            {!bettingOpen && <div className="bet-status">Closed</div>}
          </button>
          <button
            className={`bet-btn less ${selectedPrediction === 'LOW' ? 'selected' : ''}`}
            onClick={() => {
              console.log('LOW button clicked');
              setSelectedPrediction('LOW');
            }}
            disabled={!bettingOpen || isPending}
            title={!bettingOpen ? 'Betting is closed for this round' : isPending ? 'Transaction in progress' : 'Predict BTC price will go LOW'}
          >
            <div className="bet-label">LOW</div>
            <div className="bet-count">{lessBets.toString()} bets</div>
            {!bettingOpen && <div className="bet-status">Closed</div>}
          </button>
        </div>

        {selectedPrediction && (
          <button
            className="confirm-btn"
            onClick={() => handlePlaceBet(selectedPrediction)}
            disabled={isPending}
          >
            {isPending ? 'Confirming...' : `Confirm ${selectedPrediction} Bet`}
          </button>
        )}
      </div>

      {/* Prize Pool */}
      <div className="prize-pool">
        <div className="pool-label">Total Prize Pool</div>
        <div className="pool-amount">
          {totalPot ? formatEther(totalPot) : '0'} ETH
        </div>
        <div className="pool-split">90% to winners • 10% to protocol</div>
      </div>

      {/* Live Bets */}
      <div className="live-bets">
        <h3>Live Activity ({bets ? bets.length : 0} bets)</h3>
        <div className="bets-list">
          {bets && bets.length > 0 ? (
            [...bets].reverse().map((bet: Bet, index: number) => (
              <div key={index} className="bet-item">
                <div className="bet-address">
                  {bet.bettor.slice(0, 6)}...{bet.bettor.slice(-4)}
                </div>
                <div className={`bet-choice ${bet.predictMoreVolatile ? 'more' : 'less'}`}>
                  {bet.predictMoreVolatile ? 'HIGH' : 'LOW'}
                </div>
                <div className="bet-time">
                  {new Date(Number(bet.timestamp) * 1000).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="no-bets">No bets yet. Be the first!</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrentRound
