"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Trophy, ExternalLink } from "lucide-react"

const games = [
  {
    id: "superform-safari",
    name: "Superform Safari",
    description: "Collect piggies and earn XP",
    externalUrl: "https://superformsafari.v0.build",
  },
  {
    id: "piggy-catch",
    name: "Piggy Catch",
    description: "Dodge bombs, catch fruits, grab stars",
    externalUrl: "https://guileless-rabanadas-18f47d.netlify.app/",
  },
  {
    id: "piggy-jump",
    name: "Piggy Jump",
    description: "Jump across platforms",
    externalUrl: "https://extraordinary-rugelach-42fd3b.netlify.app/",
  },
  {
    id: "flappy-piggy",
    name: "Flappy Piggy",
    description: "Navigate through obstacles",
    externalUrl: "https://noctis-requiem.itch.io/flappy-piggy",
    isNew: true,
  },
  {
    id: "piggy-stars",
    name: "Piggy to the Stars",
    description: "Help piggy reach the stars",
    externalUrl: "https://noctis-requiem.itch.io/piggy-to-the-stars",
    isNew: true,
  },
]

export default function GameZoneContent() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameWindow, setGameWindow] = useState<Window | null>(null)
  const [isGameWindowOpen, setIsGameWindowOpen] = useState(false)

  const selectedGameData = games.find((g) => g.id === selectedGame)

  // Функция для открытия игры с учетом среды Farcaster
  const openGamePopup = (url: string, title: string) => {
    // Определяем, находимся ли мы в мобильном приложении Farcaster
    const isFarcasterApp =
      window.navigator.userAgent.includes("Farcaster") ||
      window.parent !== window ||
      (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0)

    // Если мы в Farcaster, просто открываем ссылку в новой вкладке
    if (isFarcasterApp) {
      window.open(url, "_blank")
      setIsGameWindowOpen(true)

      // Показываем сообщение на 3 секунды
      setTimeout(() => {
        setIsGameWindowOpen(false)
      }, 3000)

      return
    }

    // Для обычного веб-браузера используем popup как раньше
    // Закрываем предыдущее окно, если оно открыто
    if (gameWindow && !gameWindow.closed) {
      gameWindow.close()
    }

    // Вычисляем размеры и позицию окна
    const width = Math.min(window.innerWidth - 40, 1024)
    const height = Math.min(window.innerHeight - 40, 768)
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    // Открываем новое окно
    const newWindow = window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,location=yes`,
    )

    if (newWindow) {
      setGameWindow(newWindow)
      setIsGameWindowOpen(true)

      // Проверяем, когда окно закрывается
      const checkIfClosed = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(checkIfClosed)
          setIsGameWindowOpen(false)
        }
      }, 1000)
    }
  }

  // Обработчик для кнопки Play
  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId)
    const game = games.find((g) => g.id === gameId)

    if (game?.externalUrl) {
      openGamePopup(game.externalUrl, game.name)
    }
  }

  // Обработчик для кнопки Back
  const handleBackToList = () => {
    setSelectedGame(null)
  }

  // Обработчик для кнопки Open in New Tab
  const handleOpenExternal = () => {
    if (selectedGameData?.externalUrl) {
      window.open(selectedGameData.externalUrl, "_blank")
    }
  }

  // Закрываем окно игры при размонтировании компонента
  useEffect(() => {
    return () => {
      if (gameWindow && !gameWindow.closed) {
        gameWindow.close()
      }
    }
  }, [gameWindow])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Gamepad2 className="h-6 w-6 text-[#ff1493]" />
        <h2 className="text-lg font-bold text-[#ff1493]">Porkade (Community games)</h2>
      </div>

      {!selectedGame ? (
        <div className="grid gap-2">
          {games.map((game) => (
            <Card
              key={game.id}
              className="bg-black border-[#ff1493]/30 hover:border-[#ff1493] cursor-pointer transition-colors"
              onClick={() => handlePlayGame(game.id)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-white">{game.name}</h3>
                    {game.isNew && (
                      <span className="bg-[#ff1493] text-white text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{game.description}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#ff1493] hover:bg-[#ff1493]/80 h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayGame(game.id)
                  }}
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black border-[#ff1493]/30">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">{selectedGameData?.name}</h3>
              <Button
                size="sm"
                variant="outline"
                className="border-[#ff1493]/50 text-[#ff1493] hover:bg-[#ff1493]/10 h-7 text-xs"
                onClick={handleBackToList}
              >
                Back
              </Button>
            </div>

            {selectedGameData?.externalUrl ? (
              <>
                <div className="aspect-video bg-[#ff1493]/10 rounded-lg flex flex-col items-center justify-center mb-3 p-4">
                  <div className="text-center mb-4">
                    <Trophy className="h-12 w-12 text-[#ff1493]/50 mx-auto mb-2" />
                    <h4 className="text-white font-bold mb-1">{selectedGameData.name}</h4>
                    {isGameWindowOpen ? (
                      <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs inline-block mb-2">
                        Game is running in a popup window
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 mb-2">Play this game in a popup window</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="bg-[#ff1493] hover:bg-[#ff1493]/80 text-sm"
                      onClick={() => openGamePopup(selectedGameData.externalUrl!, selectedGameData.name)}
                    >
                      {isGameWindowOpen ? "Relaunch Game" : "Launch Game"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#ff1493]/50 text-[#ff1493] hover:bg-[#ff1493]/10 text-sm"
                      onClick={handleOpenExternal}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open in Browser Tab
                    </Button>
                  </div>
                </div>

                <div className="bg-[#ff1493]/5 border border-[#ff1493]/20 rounded-lg p-3 text-xs text-gray-400">
                  <p className="mb-2">
                    <strong className="text-white">Note:</strong> When playing in Farcaster:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>The game will open in your device's browser</li>
                    <li>You may need to switch back to Farcaster after playing</li>
                    <li>Game progress is saved between sessions</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="aspect-video bg-[#ff1493]/10 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-[#ff1493]/50 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Here will be the game {selectedGameData?.name}</p>
                  </div>
                </div>

                <Button size="sm" className="w-full bg-[#ff1493] hover:bg-[#ff1493]/80 text-sm">
                  Start game
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
