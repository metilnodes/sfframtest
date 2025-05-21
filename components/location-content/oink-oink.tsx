"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Send, User, LogIn, Clock, Heart } from "lucide-react"
import { farcasterClient, type FarcasterUser } from "@/lib/farcaster-client"

// Тип для сообщения в чате
interface ChatMessage {
  id: string
  userId: string
  username: string
  displayName?: string
  pfp?: string
  message: string
  timestamp: string
  reactions?: {
    likes: number
    hasLiked?: boolean
  }
}

export default function OinkOinkContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [currentUser, setCurrentUser] = useState<FarcasterUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Загрузка сообщений из localStorage и проверка авторизации при монтировании
  useEffect(() => {
    // Загружаем сохраненные сообщения
    const savedMessages = localStorage.getItem("oinkOinkMessages")
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error("Failed to parse saved messages:", error)
      }
    } else {
      // Если нет сохраненных сообщений, добавляем приветственное сообщение
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        userId: "system",
        username: "OinkOinkBot",
        displayName: "OINK OINK Bot",
        message: "Welcome to OINK OINK chat! Connect your Farcaster account to start chatting.",
        timestamp: new Date().toISOString(),
        reactions: { likes: 0 },
      }
      setMessages([welcomeMessage])
    }

    // Проверяем, авторизован ли пользователь
    checkAuthStatus()

    setIsLoading(false)
  }, [])

  // Сохранение сообщений в localStorage при их изменении
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("oinkOinkMessages", JSON.stringify(messages))
    }
  }, [messages])

  // Прокрутка к последнему сообщению при добавлении новых
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Проверка статуса авторизации
  const checkAuthStatus = async () => {
    try {
      // Проверяем, есть ли сохраненная сессия
      const savedUser = localStorage.getItem("farcasterUser")
      if (savedUser) {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Failed to check auth status:", error)
    }
  }

  // Подключение к Farcaster
  const connectFarcaster = async () => {
    try {
      setIsLoading(true)
      const user = await farcasterClient.connect()
      setCurrentUser(user)
      setIsConnected(true)

      // Сохраняем пользователя в localStorage
      localStorage.setItem("farcasterUser", JSON.stringify(user))

      // Добавляем системное сообщение о подключении
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: "system",
        username: "OinkOinkBot",
        displayName: "OINK OINK Bot",
        message: `${user.displayName || user.username} has joined the chat!`,
        timestamp: new Date().toISOString(),
        reactions: { likes: 0 },
      }
      setMessages((prev) => [...prev, systemMessage])

      setIsLoading(false)
    } catch (error) {
      console.error("Failed to connect to Farcaster:", error)
      setIsLoading(false)
    }
  }

  // Отключение от Farcaster
  const disconnectFarcaster = async () => {
    try {
      await farcasterClient.disconnect()
      setCurrentUser(null)
      setIsConnected(false)

      // Удаляем пользователя из localStorage
      localStorage.removeItem("farcasterUser")

      // Добавляем системное сообщение об отключении
      if (currentUser) {
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: "system",
          username: "OinkOinkBot",
          displayName: "OINK OINK Bot",
          message: `${currentUser.displayName || currentUser.username} has left the chat.`,
          timestamp: new Date().toISOString(),
          reactions: { likes: 0 },
        }
        setMessages((prev) => [...prev, systemMessage])
      }
    } catch (error) {
      console.error("Failed to disconnect from Farcaster:", error)
    }
  }

  // Отправка сообщения
  const sendMessage = () => {
    if (!inputMessage.trim() || !isConnected || !currentUser) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.fid,
      username: currentUser.username,
      displayName: currentUser.displayName,
      pfp: currentUser.pfp,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      reactions: { likes: 0 },
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")

    // Имитация ответа от другого пользователя (для демонстрации)
    if (Math.random() > 0.7) {
      setTimeout(
        () => {
          const botResponses = [
            "Oink oink! 🐖",
            "How's everyone doing today?",
            "Anyone excited about the new NFT drop?",
            "The Casino games are so fun!",
            "Has anyone checked out the Piggy Bank rewards?",
            "I just got a rare NFT from the NFT HALL!",
            "What's your favorite game in the GAME ZONE?",
            "The Piggy AI gave me some great advice today.",
            "Just made a big win at the slots! 🎰",
            "OINK to the moon! 🚀",
          ]

          const randomUsers = [
            { fid: "54321", username: "crypto_pig", displayName: "Crypto Pig" },
            { fid: "98765", username: "nft_lover", displayName: "NFT Enthusiast" },
            { fid: "24680", username: "piggy_bank", displayName: "Piggy Banker" },
            { fid: "13579", username: "game_master", displayName: "Game Master" },
          ]

          const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)]
          const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

          const botMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: randomUser.fid,
            username: randomUser.username,
            displayName: randomUser.displayName,
            message: randomResponse,
            timestamp: new Date().toISOString(),
            reactions: { likes: 0 },
          }

          setMessages((prev) => [...prev, botMessage])
        },
        1000 + Math.random() * 2000,
      ) // Случайная задержка между 1 и 3 секундами
    }
  }

  // Обработка нажатия Enter для отправки сообщения
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  // Лайк сообщения
  const likeMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                likes: msg.reactions?.hasLiked ? msg.reactions.likes - 1 : (msg.reactions?.likes || 0) + 1,
                hasLiked: !msg.reactions?.hasLiked,
              },
            }
          : msg,
      ),
    )
  }

  // Форматирование времени
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Получение инициалов из имени для аватара
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-[#ff1493]" />
          <h2 className="text-lg font-bold text-[#ff1493]">OINK-OINK Chat</h2>
        </div>

        {isConnected && currentUser ? (
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectFarcaster}
            className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 text-xs"
          >
            <User className="h-3 w-3 mr-1" />
            {currentUser.displayName || currentUser.username}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={connectFarcaster}
            className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 text-xs"
            disabled={isLoading}
          >
            <LogIn className="h-3 w-3 mr-1" />
            Connect Farcaster
          </Button>
        )}
      </div>

      <Card className="bg-black border-[#ff1493]/30">
        <CardContent className="p-3">
          <div className="space-y-3 mb-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#ff00ff]/20 scrollbar-track-transparent pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#ff1493]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {msg.pfp ? (
                    <img
                      src={msg.pfp || "/placeholder.svg"}
                      alt={msg.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium text-[#ff1493]">
                      {getInitials(msg.displayName || msg.username)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium text-xs">{msg.displayName || msg.username}</span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-2 w-2 mr-0.5" />
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div className="bg-[#ff1493]/10 rounded-lg p-2 text-sm relative group">
                    <p>{msg.message}</p>

                    {/* Кнопка лайка */}
                    <button
                      className={`absolute -right-1 -bottom-1 bg-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                        msg.reactions?.hasLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                      }`}
                      onClick={() => likeMessage(msg.id)}
                    >
                      <Heart className="h-3 w-3" />
                    </button>

                    {/* Счетчик лайков */}
                    {(msg.reactions?.likes || 0) > 0 && (
                      <div className="absolute -right-6 -bottom-1 text-xs text-gray-400">{msg.reactions?.likes}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={isConnected ? "Type a message..." : "Connect Farcaster to chat..."}
              className="border-[#ff1493]/50 focus-visible:ring-[#ff1493] text-sm h-9"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
            />
            <Button
              size="sm"
              className="bg-[#ff1493] hover:bg-[#ff1493]/80 h-9 w-9 p-0"
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Информация о чате */}
      <div className="text-xs text-gray-400 text-center space-y-2">
        <div>
          <p>Chat with other Farcaster users in the PIGGY WORLD community.</p>
          <p>All messages are public and stored locally in your browser.</p>
        </div>
        <div className="flex justify-center gap-2">
          <a
            href="https://discord.gg/superform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs py-1 px-3 rounded-full transition-colors"
          >
            Join our Discord
          </a>
          <a
            href="https://t.me/piggyisforthepeople"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs py-1 px-3 rounded-full transition-colors"
          >
            Join our Telegram
          </a>
        </div>
      </div>
    </div>
  )
}
