"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogIn, Heart } from "lucide-react"
import { PiggyWorldProvider, usePiggyWorld } from "@/lib/piggy-world-context"
import { farcasterMiniApp } from "@/lib/farcaster-mini-app"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Import location contents
import PiggyAiContent from "@/components/location-content/piggy-ai"
import PiggyBankContent from "@/components/location-content/piggy-bank"
import CasinoContent from "@/components/location-content/casino"
import NftHallContent from "@/components/location-content/nft-hall"
import SuperformAreaContent from "@/components/location-content/superform-area"
import OinkOinkContent from "@/components/location-content/oink-oink"
import GameZoneContent from "@/components/location-content/game-zone"

// Locations data с обновленными размерами и позициями
const locationsData = [
  {
    id: "piggy-ai",
    name: "Piggy AI",
    image: "/images/locations/PIGGY-AI.png",
    position: { top: "86px", left: "26px" }, // Поднято вверх на 3px (89-3=86)
    width: 130,
    height: 130,
    description: "Коллекция уникальных NFT и SuperFrens",
    content: NftHallContent,
  },
  {
    id: "piggy-bank",
    name: "Piggy Bank",
    image: "/images/locations/PIGGY-BANK.png",
    position: { top: "248px", left: "165px" },
    width: 105,
    height: 105,
    description: "Храните и приумножайте свои средства",
    content: PiggyBankContent,
  },
  {
    id: "casino",
    name: "Casino",
    image: "/images/locations/CASINO.png",
    position: { top: "75px", right: "30px" },
    width: 109,
    height: 109,
    description: "Испытайте удачу и выиграйте призы",
    content: CasinoContent,
  },
  {
    id: "nft-hall",
    name: "PNN",
    image: "/images/locations/PNN.png",
    position: { bottom: "10px", left: "38px" }, // Поднято вверх на 2px (5+2=7) и вправо на 3px (30+3=33)
    width: 124,
    height: 124,
    description: "Piggy News Network - последние новости",
    content: PiggyAiContent,
  },
  {
    id: "superform-area",
    name: "SUPERFORM AREA",
    image: "/images/locations/SUPERFORMAREA.png",
    position: { top: "297px", right: "22px" },
    width: 120,
    height: 120,
    description: "Создавайте супер-формы",
    content: SuperformAreaContent,
  },
  {
    id: "oink-oink",
    name: "Oink-Oink",
    image: "/images/locations/OINK-OINK.png",
    position: { top: "373px", left: "19px" }, // Сдвинуто вправо на 1px (15+1=16)
    width: 114, // Уменьшено на 5% (124 * 0.95 = 117.8 ≈ 118)
    height: 114, // Уменьшено на 5%
    description: "Общайтесь с другими свинками",
    content: OinkOinkContent,
  },
  {
    id: "game-zone",
    name: "GAME ZONE",
    image: "/images/locations/GAME-ZONE.png",
    position: { bottom: "11px", right: "37px" },
    width: 87,
    height: 87,
    description: "Играйте в мини-игры и зарабатывайте награды",
    content: GameZoneContent,
  },
]

function PiggyWorldApp() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  // Используем locationsData вместо initialLocations
  const [locations, setLocations] = useState(locationsData)
  const { connected, connectWallet, balance } = usePiggyWorld()
  const backgroundImage = "/images/back-piggy.png"
  const [farcasterUser, setFarcasterUser] = useState<any>(null)
  const [isFarcasterAvailable, setIsFarcasterAvailable] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  const { toast } = useToast()

  // Ключ для принудительного перерендера карты
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    // Проверяем доступность Farcaster Mini App SDK
    const checkFarcasterAvailability = async () => {
      const isAvailable = farcasterMiniApp.isAvailable()
      setIsFarcasterAvailable(isAvailable)

      if (isAvailable) {
        // Пытаемся получить текущего пользователя
        const user = await farcasterMiniApp.getUser()
        if (user) {
          setFarcasterUser(user)
        }
      }
    }

    checkFarcasterAvailability()

    // Принудительно обновляем значения для карты при инициализации
    setMapKey((prev) => prev + 1)
  }, [])

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId)
  }

  const handleCloseDialog = () => {
    setSelectedLocation(null)
  }

  const handleFarcasterLogin = async () => {
    if (farcasterMiniApp.isAvailable()) {
      const success = await farcasterMiniApp.authenticate()
      if (success) {
        const user = await farcasterMiniApp.getUser()
        setFarcasterUser(user)
      }
    }
  }

  // Функция для добавления приложения в избранное
  const handleAddToFavorites = async () => {
    if (!farcasterMiniApp.isAvailable()) {
      toast({
        title: "Ошибка",
        description: "Farcaster Mini App SDK недоступен",
        variant: "destructive",
      })
      return
    }

    setIsAddingToFavorites(true)

    try {
      const success = await farcasterMiniApp.addMiniApp()

      if (success) {
        toast({
          title: "Успех!",
          description: "PIGGY WORLD добавлен в избранное",
          variant: "success",
        })
      } else {
        toast({
          title: "Не удалось добавить",
          description: "Произошла ошибка при добавлении в избранное",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding to favorites:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении в избранное",
        variant: "destructive",
      })
    } finally {
      setIsAddingToFavorites(false)
    }
  }

  const selectedLocationData = locations.find((loc) => loc.id === selectedLocation)
  const LocationContent = selectedLocationData?.content

  return (
    <div className="relative w-full min-h-[100vh] flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[424px] h-[695px] mx-auto bg-black overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image src={backgroundImage || "/placeholder.svg"} alt="PIGGY WORLD" fill priority className="object-cover" />
        </div>

        {/* Farcaster buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {/* Add to favorites button */}
          {isFarcasterAvailable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToFavorites}
              disabled={isAddingToFavorites}
              className="bg-[#ff1493]/20 border-[#ff1493]/50 text-white hover:bg-[#ff1493]/30"
            >
              <Heart className="h-4 w-4 mr-1" />
              {isAddingToFavorites ? "Добавление..." : "В избранное"}
            </Button>
          )}

          {/* Login button */}
          {isFarcasterAvailable && !farcasterUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleFarcasterLogin}
              className="bg-[#ff1493]/20 border-[#ff1493]/50 text-white hover:bg-[#ff1493]/30"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Connect
            </Button>
          )}

          {/* User info (if logged in) */}
          {farcasterUser && (
            <div className="bg-black/50 rounded-full px-3 py-1 text-xs text-white flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#ff1493]/30 flex items-center justify-center mr-2">
                {farcasterUser.pfp ? (
                  <Image
                    src={farcasterUser.pfp || "/placeholder.svg"}
                    alt={farcasterUser.displayName || farcasterUser.username}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <span>{(farcasterUser.displayName || farcasterUser.username || "").substring(0, 1)}</span>
                )}
              </div>
              <span>{farcasterUser.displayName || farcasterUser.username}</span>
            </div>
          )}
        </div>

        {/* Interactive locations */}
        <div key={mapKey}>
          {locations.map((location) => (
            <div
              key={location.id}
              className="absolute cursor-pointer hover:scale-110 transition-transform duration-300 z-10"
              style={location.position as React.CSSProperties}
              onClick={() => handleLocationClick(location.id)}
            >
              <Image
                src={location.image || "/placeholder.svg"}
                alt={location.name}
                width={location.width}
                height={location.height}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Location dialog */}
        <Dialog open={!!selectedLocation} onOpenChange={handleCloseDialog}>
          <DialogContent className="bg-black border border-[#ff1493] text-white max-w-[424px] h-[90vh] max-h-[695px] p-4">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#ff1493] flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseDialog}
                  className="text-[#ff1493] hover:text-white hover:bg-[#ff1493]/20 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {selectedLocationData?.name || "Location"}
              </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {LocationContent ? <LocationContent /> : <div>Загрузка содержимого...</div>}
            </div>
          </DialogContent>
        </Dialog>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>
  )
}

export default function PiggyWorld() {
  return (
    <PiggyWorldProvider>
      <PiggyWorldApp />
    </PiggyWorldProvider>
  )
}
