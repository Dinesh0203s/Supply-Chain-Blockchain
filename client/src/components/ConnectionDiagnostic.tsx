'use client'

import { useState, useEffect } from 'react'

export default function ConnectionDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({
    hasMetaMask: false,
    isConnected: false,
    currentChainId: '',
    currentAccount: '',
    rpcWorking: false,
    contractDeployed: false,
    errors: [] as string[]
  })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      const errors: string[] = []
      const result = {
        hasMetaMask: false,
        isConnected: false,
        currentChainId: '',
        currentAccount: '',
        rpcWorking: false,
        contractDeployed: false,
        errors
      }

      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && window.ethereum) {
        result.hasMetaMask = true

        try {
          // Check if connected
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          }) as string[]
          
          if (accounts && accounts.length > 0) {
            result.isConnected = true
            result.currentAccount = accounts[0]
          } else {
            errors.push('MetaMask is not connected. Click "Connect" below or the MetaMask icon.')
          }

          // Check chain ID
          const chainIdHex = await window.ethereum.request({ 
            method: 'eth_chainId' 
          }) as string
          result.currentChainId = parseInt(chainIdHex, 16).toString()

          if (result.currentChainId !== '1337') {
            errors.push(`Wrong network! Currently on Chain ID ${result.currentChainId}. Click "Switch" to change to Chain ID 1337.`)
          }

          // Check RPC - only if connected and on right network
          if (result.isConnected && result.currentChainId === '1337') {
            try {
              const blockNumber = await Promise.race([
                window.ethereum.request({ method: 'eth_blockNumber' }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
              ])
              result.rpcWorking = true
            } catch (rpcError: any) {
              const errorMsg = rpcError?.message || 'Unknown error'
              if (errorMsg.includes('too many errors')) {
                errors.push('RPC connection unstable. The blockchain node might be overloaded. Wait a moment and refresh.')
              } else if (errorMsg.includes('Timeout')) {
                errors.push('RPC timeout. Check that Hardhat node is running: cd backend && npm run node')
              } else {
                errors.push(`RPC error: ${errorMsg}`)
              }
            }
          } else if (result.currentChainId === '1337') {
            // On right network but not connected
            result.rpcWorking = false
          }

          // Check contract deployment
          if (result.currentChainId === '1337') {
            result.contractDeployed = true
          } else {
            errors.push('Contract is only deployed on Chain ID 1337.')
          }

        } catch (error: any) {
          errors.push(`MetaMask error: ${error?.message || 'Unknown error'}`)
        }
      } else {
        errors.push('MetaMask not detected. Install from https://metamask.io')
      }

      setDiagnostics(result)
    }

    runDiagnostics()
    // Check every 5 seconds instead of 3 to reduce load
    const interval = setInterval(runDiagnostics, 5000)

    return () => clearInterval(interval)
  }, [])

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Failed to connect:', error)
    }
  }

  const switchNetwork = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // 1337 in hex
        })
      }
    } catch (switchError: any) {
      // Network doesn't exist, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x539',
              chainName: 'Hardhat Local',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['http://127.0.0.1:8545'],
            }],
          })
        } catch (addError: any) {
          console.error('Failed to add network:', addError)
        }
      }
    }
  }

  const allGood = diagnostics.hasMetaMask && 
                  diagnostics.isConnected && 
                  diagnostics.currentChainId === '1337' &&
                  diagnostics.rpcWorking &&
                  diagnostics.contractDeployed

  if (allGood && !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-w-md z-50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {allGood ? '✅ Connection Status' : '⚠️ Connection Issues'}
        </h3>
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
        >
          {isVisible ? '−' : '+'}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-3">
          {/* Status Checks */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className={diagnostics.hasMetaMask ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                {diagnostics.hasMetaMask ? '✓' : '✗'}
              </span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">MetaMask Installed</span>
            </div>

            <div className="flex items-center">
              <span className={diagnostics.isConnected ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                {diagnostics.isConnected ? '✓' : '✗'}
              </span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">MetaMask Connected</span>
              {!diagnostics.isConnected && diagnostics.hasMetaMask && (
                <button 
                  onClick={connectMetaMask}
                  className="ml-auto bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Connect
                </button>
              )}
            </div>

            {diagnostics.currentAccount && (
              <div className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                {diagnostics.currentAccount.slice(0, 10)}...{diagnostics.currentAccount.slice(-8)}
              </div>
            )}

            <div className="flex items-center">
              <span className={diagnostics.currentChainId === '1337' ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                {diagnostics.currentChainId === '1337' ? '✓' : '✗'}
              </span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">Correct Network (1337)</span>
              {diagnostics.currentChainId && diagnostics.currentChainId !== '1337' && (
                <button 
                  onClick={switchNetwork}
                  className="ml-auto bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
                >
                  Switch
                </button>
              )}
            </div>

            {diagnostics.currentChainId && (
              <div className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                Current: Chain ID {diagnostics.currentChainId}
              </div>
            )}

            <div className="flex items-center">
              <span className={diagnostics.rpcWorking ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                {diagnostics.rpcWorking ? '✓' : '✗'}
              </span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">RPC Connection</span>
            </div>

            <div className="flex items-center">
              <span className={diagnostics.contractDeployed ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                {diagnostics.contractDeployed ? '✓' : '✗'}
              </span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">Contract Deployed</span>
            </div>
          </div>

          {/* Errors */}
          {diagnostics.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 space-y-1">
              {diagnostics.errors.map((error, idx) => (
                <div key={idx} className="text-sm text-red-700 dark:text-red-300">
                  • {error}
                </div>
              ))}
            </div>
          )}

          {/* Action Required */}
          {!allGood && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">What to do:</p>
              <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                {!diagnostics.hasMetaMask && (
                  <li>Install MetaMask browser extension</li>
                )}
                {diagnostics.hasMetaMask && !diagnostics.isConnected && (
                  <li>Click "Connect" button above or the MetaMask icon</li>
                )}
                {diagnostics.currentChainId && diagnostics.currentChainId !== '1337' && (
                  <li>Click "Switch" to change to Hardhat Local network</li>
                )}
                {!diagnostics.rpcWorking && (
                  <li>Check Hardhat node is running. If not, open terminal: cd backend && npm run node</li>
                )}
                {!diagnostics.rpcWorking && diagnostics.currentChainId === '1337' && (
                  <li>If node is running, try: MetaMask Settings → Advanced → Clear activity tab data, then refresh page</li>
                )}
              </ol>
            </div>
          )}

          {allGood && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 text-center">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                🎉 All systems ready!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
