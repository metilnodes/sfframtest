export default function Head() {
  return (
    <>
      <meta
        name="fc:frame"
        content={`{
  "version": "next",
  "imageUrl": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testiconUrl.png",
  "button": {
    "title": "Piggy World",
    "action": "post",
    "target": "https://v0-farcaster-app-test-publish.vercel.app/api/frame-action"
  },
  "action": {
    "type": "launch_frame",
    "url": "https://v0-farcaster-app-test-publish.vercel.app",
    "name": "Piggy World"
  }
}`}
      />
    </>
  )
}
