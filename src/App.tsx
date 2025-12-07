import React from 'react'
import { useState, useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import CurrentRound from './components/CurrentRound'
import RoundHistory from './components/RoundHistory'
import WalletConnectButton from './components/WalletConnectButton'
import './App.css'

// Farcaster MiniApp SDK (will be available in the browser)
declare global {
  interface Window {
    fc: any;
  }
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('Error caught by boundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient()

function App() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')

  // Hide Farcaster splash screen when app is ready
  useEffect(() => {
    const hideSplashScreen = async () => {
      try {
        // Check if Farcaster SDK is available
        if (window.fc && window.fc.actions && window.fc.actions.ready) {
          await window.fc.actions.ready();
          console.log('Farcaster splash screen hidden');
        }
      } catch (error) {
        console.warn('Failed to hide Farcaster splash screen:', error);
      }
    };

    // Small delay to ensure app is fully loaded
    const timer = setTimeout(hideSplashScreen, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <div className="app">
            <header className="app-header">
              <div className="app-title-container">
                <h1 className="app-title">⚡ BTC Volatility</h1>
                <div className="wallet-connect-container">
                  <WalletConnectButton />
                </div>
              </div>
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
        </ErrorBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
