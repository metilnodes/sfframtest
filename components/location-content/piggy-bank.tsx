"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, PiggyBank, Check, Copy } from "lucide-react"

export default function PiggyBankContent() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* HOW TO BUY $PIGGY Section */}
      <div className="mt-2">
        <h3 className="text-center font-bold text-white mb-4 flex items-center justify-center gap-2">
          <PiggyBank className="h-5 w-5 text-[#ff1493]" />
          HOW TO BUY $PIGGY
        </h3>

        <div className="flex flex-col gap-3">
          <a
            href="https://jumper.exchange/?fromChain=1&fromToken=0x0000000000000000000000000000000000000000&toChain=8453&toToken=0x0000000000000000000000000000000000000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
            >
              <span className="mx-auto">GET BASE ETH</span>
              <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
            </Button>
          </a>

          <a
            href="https://app.uniswap.org/explore/tokens/base/0xe3cf8dbcbdc9b220ddead0bd6342e245daff934d"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
            >
              <span className="mx-auto">BUY PIGGY ON BASE</span>
              <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
            </Button>
          </a>
        </div>
      </div>

      {/* ADVANCED ONCHAIN FINANCE Section */}
      <div className="mt-6">
        <h3 className="text-center font-bold text-white mb-4">
          ADVANCED
          <br />
          ONCHAIN FINANCE
        </h3>

        <div className="flex flex-col gap-3">
          <a
            href="https://app.uniswap.org/explore/pools/base/0xF16EAF2801D9dEd435b7fc5F0ec78048C4142C3e"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
            >
              <span className="mx-auto">PROVIDE ETH/PIGGY LIQUIDITY</span>
              <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
            </Button>
          </a>

          <a href="https://www.superform.xyz/piggy/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
            >
              <span className="mx-auto">GO TO THE SLOP BUCKET</span>
              <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
            </Button>
          </a>

          <a href="https://www.superform.xyz/vault/Ni18DxfV9gHyUIEWtjkkC/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
            >
              <span className="mx-auto">DEPOSIT IN SPICY PIGGY VAULT</span>
              <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
            </Button>
          </a>
        </div>
      </div>

      {/* Contract Address Section */}
      <div className="mt-6">
        <div
          className="bg-[#ff1493]/10 border border-[#ff1493]/30 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-[#ff1493]/20 transition-colors overflow-hidden"
          onClick={() => copyToClipboard("0xe3CF8dBcBDC9B220ddeaD0bD6342E245DAFF934d")}
        >
          <div className="overflow-x-auto w-full no-scrollbar">
            <code className="font-mono text-xs text-center block w-full">
              0xe3CF8dBcBDC9B220ddeaD0bD6342E245DAFF934d
            </code>
          </div>
          {copied ? (
            <Check className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
          ) : (
            <Copy className="h-4 w-4 text-[#ff1493] ml-2 flex-shrink-0" />
          )}
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">CA on BASE</p>
      </div>
    </div>
  )
}
