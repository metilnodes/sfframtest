import { Button } from "@/components/ui/button"
import { Sparkles, ExternalLink } from "lucide-react"

export default function SuperformAreaContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-[#ff1493]" />
        <h2 className="text-lg font-bold text-[#ff1493]">What is Superform?</h2>
      </div>

      {/* Superform Protocol Description */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-200">
          Superform is the onchain wealth app. Superform earns you the best returns on your crypto to grow your onchain
          wealth. Use SuperVaults to automatically optimize your earnings, or build your customized portfolio by
          directly depositing into over 800 earning opportunities.
        </p>
      </div>

      {/* Superform Links */}
      <div className="flex flex-col gap-3">
        <a href="https://www.superform.xyz/explore/" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
          >
            <span className="mx-auto">START EARN</span>
            <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
          </Button>
        </a>

        <a href="https://www.superform.xyz/protocols/" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
          >
            <span className="mx-auto">PROTOCOLS</span>
            <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
          </Button>
        </a>

        <a href="https://www.superform.xyz/vaults/" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
          >
            <span className="mx-auto">VAULTS</span>
            <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
          </Button>
        </a>

        <a href="https://rewards.superform.xyz/" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            className="w-full border-[#ff1493]/50 bg-[#ff1493]/10 hover:bg-[#ff1493]/20 text-white relative"
          >
            <span className="mx-auto">REWARDS</span>
            <ExternalLink className="h-4 w-4 absolute right-3 text-[#ff1493]" />
          </Button>
        </a>
      </div>

      {/* Token Information */}
      <div className="mt-6 text-center text-sm text-gray-300 space-y-3 bg-black/30 p-4 rounded-lg">
        <p>
          <span className="font-bold">$UP</span> has been announced by the Superform Foundation but is not live yet.
        </p>
        <p className="font-bold">Wen $UP token?</p>
        <p>The Superform Foundation will determine the launch date. Superform Labs has no control over this.</p>
      </div>
    </div>
  )
}
