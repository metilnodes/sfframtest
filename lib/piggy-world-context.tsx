"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type PiggyWorldContextType = {
  balance: number
  connected: boolean
  walletAddress: string | null
  connectWallet: () => Promise<void>
  updateBalance: (amount: number) => void
}

const PiggyWorldContext = createContext<PiggyWorldContextType | undefined>(undefined)

export function PiggyWorldProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const connectWallet = async () => {
    try {
      const response = await fetch("/api/connect-wallet", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setConnected(true)
        setWalletAddress(data.address)
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const updateBalance = (amount: number) => {
    setBalance(amount)
  }

  return (
    <PiggyWorldContext.Provider
      value={{
        balance,
        connected,
        walletAddress,
        connectWallet,
        updateBalance,
      }}
    >
      {children}
    </PiggyWorldContext.Provider>
  )
}

export function usePiggyWorld() {
  const context = useContext(PiggyWorldContext)
  if (context === undefined) {
    throw new Error("usePiggyWorld must be used within a PiggyWorldProvider")
  }
  return context
}
