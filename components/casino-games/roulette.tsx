"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

// Числа на рулетке
const rouletteNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
  28, 12, 35, 3, 26,
]

// Цвета чисел (0 - зеленый, остальные - красный или черный)
const numberColors: Record<number, string> = {
  0: "green",
  1: "red",
  2: "black",
  3: "red",
  4: "black",
  5: "red",
  6: "black",
  7: "red",
  8: "black",
  9: "red",
  10: "black",
  11: "black",
  12: "red",
  13: "black",
  14: "red",
  15: "black",
  16: "red",
  17: "black",
  18: "red",
  19: "red",
  20: "black",
  21: "red",
  22: "black",
  23: "red",
  24: "black",
  25: "red",
  26: "black",
  27: "red",
  28: "black",
  29: "black",
  30: "red",
  31: "black",
  32: "red",
  33: "black",
  34: "red",
  35: "black",
  36: "red",
}

// Типы ставок
type BetType = "red" | "black" | "even" | "odd" | "1-18" | "19-36" | "1st12" | "2nd12" | "3rd12" | number

interface RouletteGameProps {
  updateBalance: (amount: number) => void
  balance: number
}

export default function RouletteGame({ updateBalance, balance }: RouletteGameProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState(10)
  const [bets, setBets] = useState<Record<string, number>>({})
  const [lastWin, setLastWin] = useState(0)
  const [spinResult, setSpinResult] = useState<"win" | "lose" | null>(null)
  const [spinHistory, setSpinHistory] = useState<number[]>([])

  // Общая сумма ставок
  const totalBet = Object.values(bets).reduce((sum, bet) => sum + bet, 0)

  // Функция для размещения ставки
  const placeBet = (betType: BetType) => {
    if (spinning || balance < betAmount) return

    const betKey = betType.toString()

    setBets((prev) => ({
      ...prev,
      [betKey]: (prev[betKey] || 0) + betAmount,
    }))

    updateBalance(-betAmount)
  }

  // Функция для очистки ставок
  const clearBets = () => {
    if (spinning) return

    // Возвращаем деньги игроку
    const refundAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)
    if (refundAmount > 0) {
      updateBalance(refundAmount)
    }

    setBets({})
  }

  // Функция для вращения рулетки
  const spin = () => {
    if (spinning || totalBet === 0) return

    setSpinning(true)
    setSpinResult(null)

    // Анимация вращения
    const spinInterval = setInterval(() => {
      setResult(rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)])
    }, 100)

    // Останавливаем вращение через 3 секунды
    setTimeout(() => {
      clearInterval(spinInterval)

      // Определяем финальное число
      const finalResult = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)]
      setResult(finalResult)
      setSpinHistory((prev) => [finalResult, ...prev].slice(0, 10))

      // Проверяем выигрыш
      checkWin(finalResult)

      setSpinning(false)
    }, 3000)
  }

  // Проверка выигрыша
  const checkWin = (number: number) => {
    let winAmount = 0

    // Проверяем все ставки
    Object.entries(bets).forEach(([betKey, amount]) => {
      // Ставка на конкретное число
      if (!isNaN(Number(betKey))) {
        const betNumber = Number(betKey)
        if (betNumber === number) {
          winAmount += amount * 36
        }
      }
      // Ставка на цвет
      else if (betKey === "red" || betKey === "black") {
        if (number !== 0 && numberColors[number] === betKey) {
          winAmount += amount * 2
        }
      }
      // Ставка на четное/нечетное
      else if (betKey === "even" || betKey === "odd") {
        if (number !== 0) {
          if ((betKey === "even" && number % 2 === 0) || (betKey === "odd" && number % 2 !== 0)) {
            winAmount += amount * 2
          }
        }
      }
      // Ставка на диапазон 1-18 или 19-36
      else if (betKey === "1-18" || betKey === "19-36") {
        if (
          (betKey === "1-18" && number >= 1 && number <= 18) ||
          (betKey === "19-36" && number >= 19 && number <= 36)
        ) {
          winAmount += amount * 2
        }
      }
      // Ставка на дюжины
      else if (betKey === "1st12" || betKey === "2nd12" || betKey === "3rd12") {
        if (
          (betKey === "1st12" && number >= 1 && number <= 12) ||
          (betKey === "2nd12" && number >= 13 && number <= 24) ||
          (betKey === "3rd12" && number >= 25 && number <= 36)
        ) {
          winAmount += amount * 3
        }
      }
    })

    if (winAmount > 0) {
      updateBalance(winAmount)
      setLastWin(winAmount)
      setSpinResult("win")
    } else {
      setLastWin(0)
      setSpinResult("lose")
    }

    // Очищаем ставки после спина
    setBets({})
  }

  // Изменение суммы ставки
  const changeBetAmount = (amount: number) => {
    const newBet = betAmount + amount
    if (newBet >= 10 && newBet <= 100) {
      setBetAmount(newBet)
    }
  }

  // Получение цвета для числа
  const getNumberColor = (num: number) => {
    if (num === 0) return "bg-green-500"
    return numberColors[num] === "red" ? "bg-red-500" : "bg-black"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#ff1493]">Oinklette</h3>
        <div className="text-sm">
          Bet: <span className="font-bold">{betAmount} OINK</span>
        </div>
      </div>

      {/* Рулетка и результат */}
      <Card className="bg-black border-[#ff00ff]/30">
        <CardContent className="p-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 rounded-full border-4 border-[#ff1493]/50 flex items-center justify-center">
              <div
                className={`absolute inset-2 rounded-full ${result !== null ? getNumberColor(result) : "bg-gray-800"} flex items-center justify-center ${spinning ? "animate-spin" : ""}`}
              >
                <span className="text-white text-xl font-bold">{result !== null ? result : "?"}</span>
              </div>
            </div>
          </div>

          {/* История */}
          <div className="flex justify-center gap-1 mb-4">
            {spinHistory.slice(0, 5).map((num, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${getNumberColor(num)}`}
              >
                {num}
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

          {/* Ставки */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet("red")}
              disabled={spinning || balance < betAmount}
              className="border-red-500/30 text-red-500 hover:bg-red-500/10 relative"
            >
              Red
              {bets["red"] && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["red"]}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet("black")}
              disabled={spinning || balance < betAmount}
              className="border-white/30 text-white hover:bg-white/10 relative"
            >
              Black
              {bets["black"] && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["black"]}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet(0)}
              disabled={spinning || balance < betAmount}
              className="border-green-500/30 text-green-500 hover:bg-green-500/10 relative"
            >
              Zero
              {bets["0"] && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["0"]}
                </span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet("even")}
              disabled={spinning || balance < betAmount}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 relative"
            >
              Even
              {bets["even"] && (
                <span className="absolute -top-2 -right-2 bg-[#ff1493] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["even"]}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet("odd")}
              disabled={spinning || balance < betAmount}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 relative"
            >
              Odd
              {bets["odd"] && (
                <span className="absolute -top-2 -right-2 bg-[#ff1493] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["odd"]}
                </span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet("1-18")}
              disabled={spinning || balance < betAmount}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 relative"
            >
              1-18
              {bets["1-18"] && (
                <span className="absolute -top-2 -right-2 bg-[#ff1493] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["1-18"]}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => placeBet("19-36")}
              disabled={spinning || balance < betAmount}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 relative"
            >
              19-36
              {bets["19-36"] && (
                <span className="absolute -top-2 -right-2 bg-[#ff1493] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bets["19-36"]}
                </span>
              )}
            </Button>
          </div>

          {/* Кнопки управления */}
          <div className="flex justify-between gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeBetAmount(-10)}
              disabled={betAmount <= 10 || spinning}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
            >
              -10
            </Button>
            <Button
              className="bg-[#ff1493] hover:bg-[#ff1493]/80 flex-1"
              disabled={spinning || totalBet === 0}
              onClick={spin}
            >
              {spinning ? "Spinning..." : "Spin!"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeBetAmount(10)}
              disabled={betAmount >= 100 || spinning}
              className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
            >
              +10
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearBets}
            disabled={spinning || Object.keys(bets).length === 0}
            className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            Clear bets
          </Button>

          {/* Общая сумма ставок */}
          {totalBet > 0 && (
            <div className="mt-2 text-center text-sm">
              Total bet amount: <span className="font-bold">{totalBet} OINK</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
