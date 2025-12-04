import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESS } from '../config/wagmi'
import { contractABI } from '../contracts/abi'
import './RoundHistory.css'

function RoundHistory() {
  const { data: currentRoundId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'currentRoundId',
  })

  const roundIds = currentRoundId 
    ? Array.from({ length: Number(currentRoundId) }, (_, i) => i).reverse()
    : []

  return (
    <div className="round-history">
      <h2>Round History</h2>
      <div className="history-list">
        {roundIds.length === 0 ? (
          <div className="no-history">No completed rounds yet</div>
        ) : (
          roundIds.map((roundId) => <RoundHistoryItem key={roundId} roundId={roundId} />)
        )}
      </div>
    </div>
  )
}

function RoundHistoryItem({ roundId }: { roundId: number }) {
  const { data: roundDetails } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'getRoundDetails',
    args: [BigInt(roundId)],
  })

  const { data: bets } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'getRoundBets',
    args: [BigInt(roundId)],
  })

  if (!roundDetails || !roundDetails[3]) return null // Not settled yet

  const [volatilityPercent, moreVolatileWon, totalPot, settled] = roundDetails

  if (!settled) return null

  const winningBets = bets 
    ? bets.filter((bet: any) => bet.predictMoreVolatile === moreVolatileWon).length
    : 0

  return (
    <div className="history-item">
      <div className="history-header">
        <div className="history-round">Round #{roundId}</div>
        <div className={`history-winner ${moreVolatileWon ? 'more' : 'less'}`}>
          {moreVolatileWon ? 'MORE' : 'LESS'} Won
        </div>
      </div>

      <div className="history-stats">
        <div className="stat">
          <div className="stat-label">Volatility</div>
          <div className="stat-value">{(Number(volatilityPercent) / 100).toFixed(2)}%</div>
        </div>
        <div className="stat">
          <div className="stat-label">Prize Pool</div>
          <div className="stat-value">{formatEther(totalPot)} ETH</div>
        </div>
        <div className="stat">
          <div className="stat-label">Winners</div>
          <div className="stat-value">{winningBets}</div>
        </div>
      </div>

      <div className="history-details">
        <p className="detail-text">
          Volatility: {(Number(volatilityPercent) / 100).toFixed(2)}%
        </p>
        <p className="detail-text">
          Total Bets: {bets ? bets.length : 0}
        </p>
      </div>
    </div>
  )
}

export default RoundHistory
