import { NextResponse } from "next/server"

export async function GET() {
  // Манифест Farcaster Mini App с обновленной структурой и правильными URL
  const manifest = {
    frame: {
      version: "1",
      name: "PIGGY WORLD",
      homeUrl: "https://v0-farcaster-app-test-publish.vercel.app",
      iconUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testiconUrl.png",
      splashImageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testiconUrl.png",
      splashBackgroundColor: "#000000",
      screenshotUrls: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testiconUrl.png"],
    },
  }

  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
}
