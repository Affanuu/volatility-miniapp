import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import CurrentRound from './components/CurrentRound'
import RoundHistory from './components/RoundHistory'
import './App.css'

const queryClient = new QueryClient()

function App() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="app">
          <header className="app-header">
            <h1 className="app-title">⚡ BTC Volatility</h1>
            <p className="app-subtitle">Predict BTC volatility on Base</p>
          </header>

          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              Current Round
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </nav>

          <main className="app-content">
            {activeTab === 'current' ? <CurrentRound /> : <RoundHistory />}
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
