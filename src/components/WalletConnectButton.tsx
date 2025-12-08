import { useAccount, useConnect, useDisconnect } from 'wagmi'

function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="wallet-info">
        <div className="wallet-address">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <button className="disconnect-button" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  // Use the first available connector (typically MetaMask)
  const connector = connectors[0]

  // If no connectors are available, show a message
  if (!connector) {
    return (
      <div className="wallet-info" style={{ color: 'white', fontSize: '0.8rem', backgroundColor: 'rgba(255, 0, 0, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
        No wallet found - Install MetaMask
      </div>
    )
  }

  return (
    <button className="connect-button" onClick={() => connect({ connector })}>
      Connect Wallet
    </button>
  )
}

export default WalletConnectButton