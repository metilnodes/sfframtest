import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PIGGY WORLD",
  description: "PIGGY WORLD FARCASTER MINI APP",
  // Standard meta tags
  openGraph: {
    title: "PIGGY WORLD",
    description: "PIGGY WORLD FARCASTER MINI APP",
    images: ["https://v0-farcaster-app-test-publish.vercel.app/images/back-piggy.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Farcaster Mini App SDK */}
        <Script src="https://unpkg.com/@farcaster/mini-app@0.1.0/dist/index.umd.js" strategy="beforeInteractive" />

        {/* Custom meta tag for Farcaster Frame */}
        <meta
          name="fc:frame"
          content={`{
"version": "next",
"imageUrl": "https://v0-farcaster-app-test-publish.vercel.app/images/back-piggy.png",
"button": {
  "title": "Играть в Piggy World",
  "action": {
    "type": "launch_frame",
    "url": "https://v0-farcaster-app-test-publish.vercel.app"
  }
}
}`}
        />

        {/* Mini App manifest */}
        <meta name="fc:mini-app" content="true" />
        <meta
          name="fc:mini-app:manifest"
          content="https://v0-farcaster-app-test-publish.vercel.app/.well-known/farcaster.json"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
