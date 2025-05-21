import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Получаем данные из запроса Farcaster Frame
    const data = await request.json()

    // Здесь можно обработать действия пользователя
    // data.untrustedData содержит информацию о пользователе и его действии

    // Возвращаем ответ с новым состоянием фрейма
    return NextResponse.json({
      status: "success",
      message: "Welcome to PIGGY WORLD!",
      // Обновляем фрейм
      frames: {
        version: "next",
        image: "https://piggy-world.vercel.app/images/back-piggy.png",
        buttons: [
          {
            label: "Открыть приложение",
            action: "link",
            target: "https://piggy-world.vercel.app",
          },
        ],
      },
    })
  } catch (error) {
    console.error("Error processing frame action:", error)
    return NextResponse.json({ error: "Failed to process frame action" }, { status: 500 })
  }
}
