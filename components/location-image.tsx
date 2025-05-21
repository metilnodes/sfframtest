"use client"

import Image from "next/image"

interface LocationImageProps {
  src: string
  alt: string
  width: number
  height: number
  onClick: () => void
}

export default function LocationImage({ src, alt, width, height, onClick }: LocationImageProps) {
  return (
    <div className="cursor-pointer hover:scale-110 transition-transform duration-300" onClick={onClick}>
      <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="object-contain" />
    </div>
  )
}
