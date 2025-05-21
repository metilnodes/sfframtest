"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dices, ChevronRight, ArrowLeft, Coins } from "lucide-react"
import Image from "next/image"

// Import games
import SlotsGame from "@/components/casino-games/slots"
import RouletteGame from "@/components/casino-games/roulette"
import PokerGame from "@/components/casino-games/poker"
import DailyCheckIn from "@/components/casino-games/daily-check-in"

// Game types
type GameType = "slots" | "poker" | "roulette"

// Available games data
const games = [
  {
    id: "slots",
    name: "Oink & Spin",
    description: "Feed the reels with coins and squeal at your wins!",
    icon: "/cartoon-pig-slot-machine.png",
    component: SlotsGame,
    color: "#ff00ff",
    gradient: "from-[#ff00ff]/20 to-[#ff00ff]/5",
  },
  {
    id: "poker",
    name: "Piggy Hold'em",
    description: "All-in or oink out",
    icon: "/images/piggy-poker.png",
    component: PokerGame,
    color: "#00ffff",
    gradient: "from-[#00ffff]/20 to-[#00ffff]/5",
  },
  {
    id: "roulette",
    name: "Oinklette",
    description: "Spin the wheel, squeal the deal",
    icon: "/images/piggy-roulette.png",
    component: RouletteGame,
    color: "#ffff00",
    gradient: "from-[#ffff00]/20 to-[#ffff00]/5",
  },
]

export default function CasinoContent() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)
  const [balance, setBalance] = useState(1000) // Player balance in OINK

  // Select game
  const handleSelectGame = (gameId: GameType) => {
    setSelectedGame(gameId)
  }

  // Return to game list
  const handleBackToList = () => {
    setSelectedGame(null)
  }

  // Update balance (for use in games)
  const updateBalance = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  // If a game is selected, show it
  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame)
    const GameComponent = game?.component

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="text-[#ff1493] hover:text-white hover:bg-[#ff1493]/20 p-0 h-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to games</span>
          </Button>

          <div className="flex items-center gap-1 bg-[#ff1493]/10 px-2 py-1 rounded-full">
            <Coins className="h-3 w-3 text-[#ff1493]" />
            <span className="text-sm font-medium">{balance} OINK</span>
          </div>
        </div>

        {GameComponent && <GameComponent updateBalance={updateBalance} balance={balance} />}
      </div>
    )
  }

  // Show game list
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Dices className="h-6 w-6 text-[#ff1493]" />
        <h2 className="text-lg font-bold text-[#ff1493]">Oink-O-Luck</h2>
      </div>

      <div className="bg-[#ff1493]/10 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-[#ff1493]" />
          <div>
            <div className="text-sm font-medium">Your balance</div>
            <div className="text-lg font-bold">
              {balance} <span className="text-xs opacity-70">OINK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {games.map((game) => (
          <Card
            key={game.id}
            className={`bg-gradient-to-br ${game.gradient} border border-${game.color}/30 hover:border-${game.color}/60 cursor-pointer transition-all duration-300`}
            onClick={() => handleSelectGame(game.id as GameType)}
          >
            <CardContent className="p-3 flex items-center">
              <div className="w-12 h-12 rounded-lg bg-black/30 flex items-center justify-center mr-3 flex-shrink-0">
                <Image
                  src={game.icon || "/placeholder.svg"}
                  alt={game.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{game.name}</h3>
                <p className="text-xs text-white/70">{game.description}</p>
              </div>
              <ChevronRight className={`h-5 w-5 text-${game.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <DailyCheckIn updateBalance={updateBalance} />
      </div>
    </div>
  )
}
