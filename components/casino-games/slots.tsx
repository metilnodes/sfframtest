"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

// Символы для слотов с их множителями (новые животные)
const slotItems = [
  { symbol: "🐖", multiplier: 50 }, // Pig - самый ценный символ
  { symbol: "🐸", multiplier: 20 }, // Frog
  { symbol: "🦍", multiplier: 10 }, // Ape
  { symbol: "👽", multiplier: 8 }, // Alien
  { symbol: "🐍", multiplier: 6 }, // Snake
  { symbol: "🦖", multiplier: 4 }, // Dino
  { symbol: "🐋", multiplier: 2 }, // Whale
]

interface SlotsGameProps {
  updateBalance: (amount: number) => void
  balance: number
}

export default function SlotsGame({ updateBalance, balance }: SlotsGameProps) {
  const [reels, setReels] = useState<string[]>(["❓", "❓", "❓"])
  const [spinning, setSpinning] = useState(false)
  const [bet, setBet] = useState(10)
  const [lastWin, setLastWin] = useState(0)
  const [spinResult, setSpinResult] = useState<"win" | "lose" | null>(null)
  const [spinHistory, setSpinHistory] = useState<Array<{ result: "win" | "lose"; amount: number }>>([])

  // Функция для получения случайного символа с учетом вероятностей
  const getRandomSymbol = () => {
    // Значительно увеличиваем разницу в вероятностях
    // Чем выше число, тем реже выпадает символ
    const weights = [1, 3, 6, 10, 20, 40, 80]
    const totalWeight = weights.reduce((a, b) => a + b, 0)

    const random = Math.random() * totalWeight
    let weightSum = 0

    for (let i = 0; i < weights.length; i++) {
      weightSum += weights[i]
      if (random <= weightSum) {
        return slotItems[i].symbol
      }
    }

    return slotItems[slotItems.length - 1].symbol
  }

  // Функция для вращения барабанов
  const spin = () => {
    if (spinning || balance < bet) return

    // Списываем ставку
    updateBalance(-bet)

    setSpinning(true)
    setSpinResult(null)
    setReels(["❓", "❓", "❓"])

    // Анимация вращения
    let spinCount = 0
    const maxSpins = 20
    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()])
      spinCount++

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval)

        // Определяем финальные символы
        // Для каждого барабана отдельно вызываем getRandomSymbol, чтобы уменьшить шанс совпадений
        const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]

        // Добавляем дополнительную случайность для предотвращения частых совпадений
        // Иногда намеренно делаем символы разными
        if (Math.random() < 0.3) {
          // В 30% случаев гарантируем, что хотя бы один символ будет отличаться
          const randomReel = Math.floor(Math.random() * 3)
          let differentSymbol
          do {
            differentSymbol = getRandomSymbol()
          } while (differentSymbol === finalReels[0])

          finalReels[randomReel] = differentSymbol
        }

        setReels(finalReels)

        // Проверяем выигрыш
        checkWin(finalReels)

        setSpinning(false)
      }
    }, 100)
  }

  // Проверка выигрыша
  const checkWin = (currentReels: string[]) => {
    // Проверяем, все ли символы одинаковые (джекпот)
    if (currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]) {
      const symbol = currentReels[0]
      const item = slotItems.find((item) => item.symbol === symbol)

      if (item) {
        const winAmount = bet * item.multiplier
        updateBalance(winAmount)
        setLastWin(winAmount)
        setSpinResult("win")
        setSpinHistory((prev) => [...prev, { result: "win", amount: winAmount }].slice(-10))
      }
    }
    // Проверяем, есть ли два одинаковых символа
    // Делаем выигрыш только для определенных комбинаций и с меньшей вероятностью
    else if (
      (currentReels[0] === currentReels[1] ||
        currentReels[1] === currentReels[2] ||
        currentReels[0] === currentReels[2]) &&
      Math.random() < 0.6 // Только 60% шанс выигрыша даже при двух одинаковых символов
    ) {
      let symbol
      if (currentReels[0] === currentReels[1]) symbol = currentReels[0]
      else if (currentReels[1] === currentReels[2]) symbol = currentReels[1]
      else symbol = currentReels[0]

      const item = slotItems.find((item) => item.symbol === symbol)

      if (item) {
        // Уменьшаем выигрыш для двух одинаковых символов
        const winAmount = Math.floor(bet * (item.multiplier / 3))
        updateBalance(winAmount)
        setLastWin(winAmount)
        setSpinResult("win")
        setSpinHistory((prev) => [...prev, { result: "win", amount: winAmount }].slice(-10))
      }
    } else {
      setLastWin(0)
      setSpinResult("lose")
      setSpinHistory((prev) => [...prev, { result: "lose", amount: 0 }].slice(-10))
    }
  }

  // Изменение ставки
  const changeBet = (amount: number) => {
    const newBet = bet + amount
    if (newBet >= 10 && newBet <= 100) {
      setBet(newBet)
    }
  }

  // Инициализация при первой загрузке
  useEffect(() => {
    setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()])
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#ff1493]">Oink & Spin</h3>
        <div className="text-sm">
          Bet: <span className="font-bold">{bet} OINK</span>
        </div>
      </div>

      {/* Слот-машина */}
      <Card className="bg-black border-[#ff00ff]/30">
        <CardContent className="p-4">
          <div className="flex justify-center gap-2 mb-4">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className={`w-16 h-16 flex items-center justify-center text-3xl bg-gradient-to-b from-[#ff1493]/20 to-[#ff1493]/5 rounded-lg border border-[#ff1493]/30 ${
                  spinning ? "animate-pulse" : ""
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* Результат */}
          {spinResult && (
            <div className={`text-center mb-4 ${spinResult === "win" ? "text-green-500" : "text-red-500"}`}>
              {spinResult === "win" ? (
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Win: {lastWin} OINK!</span>
                  <Sparkles className="h-4 w-4" />
                </div>
              ) : (
                <span>Try again!</span>
              )}
            </div>
          )}

          {/* Кнопки управления */}
          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeBet(-10)}
              disabled={bet <= 10 || spinning}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
            >
              -10
            </Button>
            <Button
              className="bg-[#ff1493] hover:bg-[#ff1493]/80 min-w-[120px]"
              disabled={spinning || balance < bet}
              onClick={spin}
            >
              {spinning ? "Spinning..." : "Spin!"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeBet(10)}
              disabled={bet >= 100 || spinning}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
            >
              +10
            </Button>
          </div>

          {/* Информация о выигрышах */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#ff1493]/10 p-2 rounded">
              <div className="font-bold mb-1">Winning combinations:</div>
              <div className="space-y-1">
                <div>3 identical: x2-x50</div>
                <div>2 identical: small chance of x1-x16</div>
              </div>
            </div>
            <div className="bg-[#ff1493]/10 p-2 rounded">
              <div className="font-bold mb-1">Best symbols:</div>
              <div className="space-y-1">
                <div>🐖 - x50 (Pig)</div>
                <div>🐸 - x20 (Frog)</div>
                <div>🦍 - x10 (Ape)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* История спинов */}
      {spinHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Spin history:</h4>
          <div className="flex flex-wrap gap-1">
            {spinHistory.map((spin, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  spin.result === "win"
                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                    : "bg-red-500/20 text-red-500 border border-red-500/30"
                }`}
              >
                {spin.result === "win" ? "W" : "L"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
