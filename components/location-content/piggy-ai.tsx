"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, ChevronLeft, ChevronRight, Clock, ExternalLink, RefreshCw } from "lucide-react"
import Image from "next/image"

// Типы для новостей
interface NewsItem {
  id: string
  title: string
  summary: string
  imageUrl?: string
  category: "breaking" | "update" | "alert" | "new"
  timestamp: string
  url: string
}

// Имитация данных с PNN.lol
const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title: "PIGGYS CAN FLY?? SUPERFORM ANNOUNCES $UP",
    summary:
      "Superform has officially announced their governance token $UP, sending shockwaves through the DeFi community. The token is expected to launch in Q2 2024.",
    imageUrl: "/flying-piggy-up-token.png",
    category: "breaking",
    timestamp: "5 minutes ago",
    url: "https://www.pnn.lol/",
  },
  {
    id: "2",
    title: "Spectra Market for Superform Points Launches",
    summary:
      "Spectra has launched a new market for Superform Points, allowing users to trade their points ahead of the $UP token launch.",
    category: "new",
    timestamp: "1 hour ago",
    url: "https://www.pnn.lol/",
  },
  {
    id: "3",
    title: "Superform V2 Announced with Multi-chain Support",
    summary:
      "Superform has announced V2 of their protocol with expanded multi-chain support, including Arbitrum, Optimism, and Base.",
    category: "update",
    timestamp: "3 hours ago",
    url: "https://www.pnn.lol/",
  },
  {
    id: "4",
    title: "Pendle Market for Superform Points Sees Record Volume",
    summary:
      "The Pendle market for Superform Points has seen record trading volume as anticipation builds for the $UP token launch.",
    category: "alert",
    timestamp: "5 hours ago",
    url: "https://www.pnn.lol/",
  },
  {
    id: "5",
    title: "Term Market for Superform Points Opens with High Demand",
    summary:
      "The Term market for Superform Points has opened with high demand, with prices surging in the first hour of trading.",
    category: "update",
    timestamp: "8 hours ago",
    url: "https://www.pnn.lol/",
  },
  {
    id: "6",
    title: "Pigs are really cute, experts confirm",
    summary:
      "In a groundbreaking study, experts have confirmed what we all suspected: pigs are indeed really cute. The study involved showing pictures of pigs to 1,000 participants.",
    category: "update",
    timestamp: "2 days ago",
    url: "https://www.pnn.lol/",
  },
  {
    id: "7",
    title: "Dr. Hamilton Pork: 'Piggy AI is so advanced, it's started writing poetry'",
    summary:
      "Renowned AI expert Dr. Hamilton Pork claims that Piggy AI has reached a new level of sophistication, with the system now capable of writing poetry about DeFi protocols.",
    imageUrl: "/pig-professor.png",
    category: "new",
    timestamp: "3 days ago",
    url: "https://www.pnn.lol/",
  },
]

// Компонент для отображения категории новости
const NewsCategoryBadge = ({ category }: { category: NewsItem["category"] }) => {
  const categoryStyles = {
    breaking: "bg-red-500",
    update: "bg-green-500",
    alert: "bg-amber-500",
    new: "bg-blue-500",
  }

  const categoryLabels = {
    breaking: "BREAKING",
    update: "UPDATE",
    alert: "ALERT",
    new: "NEW",
  }

  return (
    <span className={`${categoryStyles[category]} text-white text-xs px-2 py-0.5 rounded-full uppercase font-bold`}>
      {categoryLabels[category]}
    </span>
  )
}

export default function PiggyAiContent() {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [news, setNews] = useState<NewsItem[]>(mockNewsData)

  // Функция для перехода к предыдущей новости
  const goToPreviousNews = () => {
    setCurrentNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))
  }

  // Функция для перехода к следующей новости
  const goToNextNews = () => {
    setCurrentNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1))
  }

  // Функция для обновления новостей (имитация)
  const refreshNews = () => {
    setIsLoading(true)

    // Имитация задержки загрузки
    setTimeout(() => {
      // Перемешиваем новости для имитации обновления
      const shuffledNews = [...news].sort(() => Math.random() - 0.5)
      setNews(shuffledNews)
      setIsLoading(false)
    }, 1000)
  }

  // Автоматическое переключение новостей каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextNews()
    }, 10000)

    return () => clearInterval(interval)
  }, [news.length])

  const currentNews = news[currentNewsIndex]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-[#ff1493]" />
          <h2 className="text-lg font-bold text-[#ff1493]">PNN News Feed</h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshNews}
          disabled={isLoading}
          className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Основная новость */}
      <Card className="bg-black border-[#ff1493]/30 overflow-hidden">
        <CardContent className="p-0">
          {currentNews.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={currentNews.imageUrl || "/placeholder.svg"}
                alt={currentNews.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16" />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <NewsCategoryBadge category={currentNews.category} />
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {currentNews.timestamp}
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2">{currentNews.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{currentNews.summary}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousNews}
                  className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextNews}
                  className="border-[#ff1493]/30 text-[#ff1493] hover:bg-[#ff1493]/10 h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <a href={currentNews.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-[#ff1493] hover:bg-[#ff1493]/80">
                  Read More
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Лента последних новостей */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Latest Updates</h3>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {news.map((item, index) => (
            <div
              key={item.id}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                index === currentNewsIndex
                  ? "bg-[#ff1493]/20 border border-[#ff1493]/30"
                  : "bg-black/50 hover:bg-[#ff1493]/10"
              }`}
              onClick={() => setCurrentNewsIndex(index)}
            >
              <div className="flex items-center justify-between mb-1">
                <NewsCategoryBadge category={item.category} />
                <span className="text-xs text-gray-400">{item.timestamp}</span>
              </div>
              <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Ссылка на PNN */}
      <div className="text-center text-xs text-gray-400 mt-4">
        <a
          href="https://www.pnn.lol/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 hover:text-[#ff1493] transition-colors"
        >
          Powered by PNN.lol
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
