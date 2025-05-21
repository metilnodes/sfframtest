"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, User } from "lucide-react"

// Масти карт
type Suit = "♠" | "♥" | "♦" | "♣"
const suits: Suit[] = ["♠", "♥", "♦", "♣"]

// Значения карт
type Value = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A"
const values: Value[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

// Карта
interface PokerCard {
  suit: Suit
  value: Value
  hidden?: boolean
}

// Стадии игры
type GameStage = "preflop" | "flop" | "turn" | "river" | "showdown" | "end"

// Действия игрока
type PlayerAction = "check" | "call" | "raise" | "fold"

interface PokerGameProps {
  updateBalance: (amount: number) => void
  balance: number
}

export default function PokerGame({ updateBalance, balance }: PokerGameProps) {
  const [deck, setDeck] = useState<PokerCard[]>([])
  const [playerHand, setPlayerHand] = useState<PokerCard[]>([])
  const [opponentHand, setOpponentHand] = useState<PokerCard[]>([])
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([])
  const [pot, setPot] = useState(0)
  const [currentBet, setCurrentBet] = useState(0)
  const [gameStage, setGameStage] = useState<GameStage | null>(null)
  const [playerTurn, setPlayerTurn] = useState(true)
  const [gameResult, setGameResult] = useState<"win" | "lose" | "tie" | null>(null)
  const [message, setMessage] = useState("")
  const [raiseAmount, setRaiseAmount] = useState(20)
  const [lastWin, setLastWin] = useState(0)

  // Инициализация игры
  const initGame = () => {
    // Создаем и перемешиваем колоду
    const newDeck = createDeck()

    // Раздаем карты
    const player = [drawCard(newDeck), drawCard(newDeck)]
    const opponent = [
      { ...drawCard(newDeck), hidden: true },
      { ...drawCard(newDeck), hidden: true },
    ]

    setDeck(newDeck)
    setPlayerHand(player)
    setOpponentHand(opponent)
    setCommunityCards([])
    setPot(30) // Начальный банк (блайнды)
    setCurrentBet(10) // Малый блайнд
    setGameStage("preflop")
    setPlayerTurn(true)
    setGameResult(null)
    setMessage("Your turn. Call 10 OINK, raise or fold?")

    // Списываем блайнды
    updateBalance(-20) // Большой блайнд игрока
  }

  // Создание перемешанной колоды
  const createDeck = (): PokerCard[] => {
    const newDeck: PokerCard[] = []

    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ suit, value })
      }
    }

    // Перемешиваем колоду
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }

    return newDeck
  }

  // Взятие карты из колоды
  const drawCard = (currentDeck: PokerCard[]): PokerCard => {
    const card = currentDeck.pop()
    if (!card) throw new Error("Колода пуста")
    return card
  }

  // Действие игрока
  const playerAction = (action: PlayerAction) => {
    if (!playerTurn || gameStage === "end" || gameStage === "showdown") return

    switch (action) {
      case "check":
        if (currentBet > 0) return // Нельзя чекать, если есть ставка
        setMessage("You checked.")
        break

      case "call":
        if (currentBet > 0) {
          updateBalance(-currentBet)
          setPot(pot + currentBet)
          setMessage(`You called ${currentBet} OINK.`)
        }
        break

      case "raise":
        if (balance < raiseAmount) return
        updateBalance(-raiseAmount)
        setPot(pot + raiseAmount)
        setCurrentBet(raiseAmount - currentBet)
        setMessage(`You raised to ${raiseAmount} OINK.`)
        break

      case "fold":
        setGameResult("lose")
        setGameStage("end")
        setMessage("You folded. Opponent takes the pot.")
        return
    }

    setPlayerTurn(false)

    // Ход оппонента после небольшой задержки
    setTimeout(() => {
      opponentAction()
    }, 1000)
  }

  // Действие оппонента (упрощенная логика)
  const opponentAction = () => {
    if (gameStage === "end" || gameStage === "showdown") return

    // Простая логика оппонента
    const randomAction = Math.random()

    if (currentBet === 0) {
      // Если нет ставки, чек или рейз
      if (randomAction < 0.7) {
        setMessage("Opponent checked.")
        advanceGame()
      } else {
        const opponentRaise = 20
        setPot(pot + opponentRaise)
        setCurrentBet(opponentRaise)
        setMessage(`Opponent raised to ${opponentRaise} OINK.`)
        setPlayerTurn(true)
      }
    } else {
      // Если есть ставка, колл или рейз
      if (randomAction < 0.8) {
        setPot(pot + currentBet)
        setMessage(`Opponent called ${currentBet} OINK.`)
        setCurrentBet(0)
        advanceGame()
      } else {
        const opponentRaise = currentBet + 20
        setPot(pot + opponentRaise)
        setCurrentBet(opponentRaise - currentBet)
        setMessage(`Opponent raised to ${opponentRaise} OINK.`)
        setPlayerTurn(true)
      }
    }
  }

  // Переход к следующей стадии игры
  const advanceGame = () => {
    switch (gameStage) {
      case "preflop":
        // Открываем флоп (3 карты)
        setCommunityCards([drawCard(deck), drawCard(deck), drawCard(deck)])
        setGameStage("flop")
        setPlayerTurn(true)
        setCurrentBet(0)
        setMessage("Flop. Your turn.")
        break

      case "flop":
        // Открываем тёрн (4-я карта)
        setCommunityCards([...communityCards, drawCard(deck)])
        setGameStage("turn")
        setPlayerTurn(true)
        setCurrentBet(0)
        setMessage("Turn. Your turn.")
        break

      case "turn":
        // Открываем ривер (5-я карта)
        setCommunityCards([...communityCards, drawCard(deck)])
        setGameStage("river")
        setPlayerTurn(true)
        setCurrentBet(0)
        setMessage("River. Your turn.")
        break

      case "river":
        // Вскрываемся
        setGameStage("showdown")
        setOpponentHand(opponentHand.map((card) => ({ ...card, hidden: false })))
        determineWinner()
        break
    }
  }

  // Определение победителя (упрощенная логика)
  const determineWinner = () => {
    // В реальной игре здесь должна быть сложная логика определения комбинаций
    // Для упрощения используем случайный результат
    const result = Math.random()

    if (result < 0.45) {
      setGameResult("win")
      setMessage("You won! Your combination is stronger.")
      setLastWin(pot)
      updateBalance(pot)
    } else if (result < 0.9) {
      setGameResult("lose")
      setMessage("You lost. Opponent's combination is stronger.")
    } else {
      setGameResult("tie")
      setMessage("Tie! The pot is split equally.")
      setLastWin(pot / 2)
      updateBalance(pot / 2)
    }

    setGameStage("end")
  }

  // Цвет карты в зависимости от масти
  const getCardColor = (suit: Suit) => {
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-white"
  }

  // Изменим функцию renderCard, чтобы карты отображались корректно
  // Отображение карты
  const renderCard = (card: PokerCard, index: number) => {
    if (card.hidden) {
      return (
        <div
          key={index}
          className="w-10 h-14 bg-[#ff1493]/20 rounded border border-[#ff1493]/30 flex items-center justify-center"
        >
          <span className="text-[#ff1493]">?</span>
        </div>
      )
    }

    // Определяем специальные стили для значения "10", так как оно шире других
    const valueClass = card.value === "10" ? "text-[10px]" : "text-xs"

    return (
      <div
        key={index}
        className="w-10 h-14 bg-white rounded border border-gray-300 flex flex-col items-center justify-between p-1 overflow-hidden"
      >
        <div className="w-full flex justify-start pl-1">
          <span className={`${valueClass} font-bold ${getCardColor(card.suit)}`}>{card.value}</span>
        </div>
        <span className={`text-xl ${getCardColor(card.suit)}`}>{card.suit}</span>
        <div className="w-full flex justify-end pr-1 rotate-180">
          <span className={`${valueClass} font-bold ${getCardColor(card.suit)}`}>{card.value}</span>
        </div>
      </div>
    )
  }

  // Начинаем игру при первой загрузке
  useEffect(() => {
    initGame()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#ff1493]">Piggy Hold'em</h3>
        <div className="text-sm">
          Pot: <span className="font-bold">{pot} OINK</span>
        </div>
      </div>

      {/* Игровой стол */}
      <Card className="bg-[#006600] border-[#ff00ff]/30">
        <CardContent className="p-4">
          {/* Оппонент */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#ff1493]/20 flex items-center justify-center">
              <User className="h-4 w-4 text-[#ff1493]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Opponent</div>
              <div className="flex gap-1 mt-1">{opponentHand.map((card, index) => renderCard(card, index))}</div>
            </div>
          </div>

          {/* Общие карты */}
          <div className="bg-[#004400] rounded-lg p-3 mb-6">
            <div className="text-xs text-center mb-2 text-white/70">Community cards</div>
            <div className="flex justify-center gap-1">
              {communityCards.length > 0 ? (
                communityCards.map((card, index) => renderCard(card, index))
              ) : (
                <div className="text-white/50 text-sm">Waiting for flop...</div>
              )}
            </div>
          </div>

          {/* Игрок */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ff1493] flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">You</div>
              <div className="flex gap-1 mt-1">{playerHand.map((card, index) => renderCard(card, index))}</div>
            </div>
          </div>

          {/* Сообщение */}
          <div className="mt-4 p-2 bg-black/30 rounded text-center text-sm">{message}</div>

          {/* Результат */}
          {gameResult && (
            <div
              className={`mt-3 text-center ${
                gameResult === "win" ? "text-green-500" : gameResult === "lose" ? "text-red-500" : "text-yellow-500"
              }`}
            >
              {gameResult === "win" && (
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Выигрыш: {lastWin} OINK!</span>
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              {gameResult === "lose" && <span>Вы проиграли!</span>}
              {gameResult === "tie" && <span>Ничья! Получено: {lastWin} OINK</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          disabled={!playerTurn || currentBet > 0 || gameStage === "end" || gameStage === "showdown"}
          onClick={() => playerAction("check")}
          className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
        >
          Check
        </Button>
        <Button
          variant="outline"
          disabled={
            !playerTurn || currentBet === 0 || gameStage === "end" || gameStage === "showdown" || balance < currentBet
          }
          onClick={() => playerAction("call")}
          className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
        >
          {currentBet > 0 ? `Call ${currentBet}` : "Call"}
        </Button>
        <Button
          disabled={!playerTurn || gameStage === "end" || gameStage === "showdown" || balance < raiseAmount}
          onClick={() => playerAction("raise")}
          className="bg-[#ff1493] hover:bg-[#ff1493]/80"
        >
          Raise {raiseAmount}
        </Button>
        <Button
          variant="outline"
          disabled={!playerTurn || gameStage === "end" || gameStage === "showdown"}
          onClick={() => playerAction("fold")}
          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
        >
          Fold
        </Button>
      </div>

      {/* Управление рейзом */}
      {playerTurn && gameStage !== "end" && gameStage !== "showdown" && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRaiseAmount(Math.max(20, raiseAmount - 10))}
            className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
          >
            -10
          </Button>
          <div className="flex-1 h-2 bg-[#ff1493]/20 rounded-full">
            <div
              className="h-full bg-[#ff1493] rounded-full"
              style={{ width: `${Math.min(100, (raiseAmount / 100) * 100)}%` }}
            ></div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRaiseAmount(Math.min(100, raiseAmount + 10))}
            className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
          >
            +10
          </Button>
        </div>
      )}

      {/* Новая игра */}
      {(gameStage === "end" || gameStage === "showdown") && (
        <Button onClick={initGame} className="w-full bg-[#ff1493] hover:bg-[#ff1493]/80 mt-2" disabled={balance < 20}>
          New game (blind 20 OINK)
        </Button>
      )}
    </div>
  )
}
