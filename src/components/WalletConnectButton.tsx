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

  return (
    <button className="connect-button" onClick={() => connector && connect({ connector })}>
      Connect Wallet
    </button>
  )
}

export default WalletConnectButton