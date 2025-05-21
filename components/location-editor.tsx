"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, X, Move } from "lucide-react"

interface LocationPosition {
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  transform?: string
}

interface Location {
  id: string
  name: string
  image: string
  position: LocationPosition
  width: number
  height: number
}

interface LocationEditorProps {
  locations: Location[]
  onSave: (locations: Location[]) => void
  onCancel: () => void
  backgroundImage: string
}

export default function LocationEditor({
  locations: initialLocations,
  onSave,
  onCancel,
  backgroundImage,
}: LocationEditorProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations)
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [locationPositions, setLocationPositions] = useState<Record<string, { x: number; y: number }>>({})

  // Инициализация позиций локаций
  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {}

    locations.forEach((location) => {
      const pos = { x: 0, y: 0 }

      if (typeof location.position.left === "string" && location.position.left.endsWith("px")) {
        pos.x = Number.parseInt(location.position.left)
      } else if (typeof location.position.left === "string" && location.position.left.endsWith("%")) {
        pos.x = (Number.parseInt(location.position.left) / 100) * containerSize.width
      }

      if (typeof location.position.top === "string" && location.position.top.endsWith("px")) {
        pos.y = Number.parseInt(location.position.top)
      } else if (typeof location.position.top === "string" && location.position.top.endsWith("%")) {
        pos.y = (Number.parseInt(location.position.top) / 100) * containerSize.height
      }

      newPositions[location.id] = pos
    })

    setLocationPositions(newPositions)
  }, [locations, containerSize])

  // Обновление размеров контейнера
  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }
  }, [])

  // Обработчик начала перетаскивания
  const handleMouseDown = (e: React.MouseEvent, locationId: string) => {
    setActiveLocation(locationId)
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  // Обработчик перетаскивания
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !activeLocation) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y

    setStartPos({ x: e.clientX, y: e.clientY })

    setLocationPositions((prev) => ({
      ...prev,
      [activeLocation]: {
        x: prev[activeLocation].x + deltaX,
        y: prev[activeLocation].y + deltaY,
      },
    }))
  }

  // Обработчик окончания перетаскивания
  const handleMouseUp = () => {
    setIsDragging(false)
    setActiveLocation(null)
  }

  // Сохранение позиций
  const handleSave = () => {
    const updatedLocations = locations.map((location) => {
      const pos = locationPositions[location.id]

      return {
        ...location,
        position: {
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        },
      }
    })

    onSave(updatedLocations)
  }

  // Вывод позиций в консоль для копирования
  const logPositions = () => {
    const positionsCode = locations
      .map((location) => {
        const pos = locationPositions[location.id]
        return `{
  id: "${location.id}",
  name: "${location.name}",
  image: "${location.image}",
  position: { top: "${pos.y}px", left: "${pos.x}px" },
  width: ${location.width},
  height: ${location.height},
},`
      })
      .join("\n")

    console.log("// Скопируйте этот код для обновления позиций:")
    console.log(positionsCode)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      <div className="bg-black p-4 border-b border-[#ff00ff]/30 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#ff00ff]">Редактор позиций локаций</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/10"
            onClick={logPositions}
          >
            Вывести позиции
          </Button>
          <Button size="sm" className="bg-[#ff00ff] hover:bg-[#ff00ff]/80" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Сохранить
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/10"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="relative w-full max-w-[414px] h-[700px] mx-auto bg-black overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={backgroundImage || "/placeholder.svg"}
              alt="PIGGY WORLD"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Locations */}
          {locations.map((location) => (
            <div
              key={location.id}
              className={`absolute cursor-move flex flex-col items-center ${activeLocation === location.id ? "ring-2 ring-[#ff00ff]" : ""}`}
              style={{
                left: `${locationPositions[location.id]?.x || 0}px`,
                top: `${locationPositions[location.id]?.y || 0}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, location.id)}
            >
              <div className="relative">
                <Image
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  width={location.width}
                  height={location.height}
                  className="object-contain"
                />
                <div className="absolute -top-2 -right-2 bg-[#ff00ff] rounded-full p-1">
                  <Move className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-1 px-1 py-0.5 bg-black/70 rounded text-xs text-white">{location.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black p-4 border-t border-[#ff00ff]/30">
        <Card className="bg-black border-[#ff00ff]/30">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-base text-white">Инструкция</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0 text-sm">
            <ol className="list-decimal pl-4 space-y-1">
              <li>Перетаскивайте локации, чтобы изменить их положение</li>
              <li>Нажмите "Вывести позиции" для получения кода с координатами</li>
              <li>Нажмите "Сохранить" для применения изменений</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
