// Типы для Farcaster Mini App SDK
declare global {
  interface Window {
    FarcasterMiniApp?: {
      getUser: () => Promise<{
        fid: number
        username: string
        displayName?: string
        pfp?: string
      } | null>
      authenticate: () => Promise<boolean>
      openProfile: (fid: number) => void
      openCast: (castHash: string) => void
      publishCast: (text: string, options?: any) => Promise<string>
      addMiniApp: () => Promise<boolean> // Добавляем метод addMiniApp
    }
  }
}

// Класс для работы с Farcaster Mini App SDK
export class FarcasterMiniAppClient {
  private isInitialized = false

  // Проверка доступности SDK
  public isAvailable(): boolean {
    return typeof window !== "undefined" && !!window.FarcasterMiniApp
  }

  // Получение текущего пользователя
  public async getUser() {
    if (!this.isAvailable()) {
      console.warn("Farcaster Mini App SDK is not available")
      return null
    }

    try {
      return await window.FarcasterMiniApp!.getUser()
    } catch (error) {
      console.error("Failed to get user:", error)
      return null
    }
  }

  // Аутентификация пользователя
  public async authenticate() {
    if (!this.isAvailable()) {
      console.warn("Farcaster Mini App SDK is not available")
      return false
    }

    try {
      return await window.FarcasterMiniApp!.authenticate()
    } catch (error) {
      console.error("Failed to authenticate:", error)
      return false
    }
  }

  // Публикация каста
  public async publishCast(text: string, options?: any) {
    if (!this.isAvailable()) {
      console.warn("Farcaster Mini App SDK is not available")
      return ""
    }

    try {
      return await window.FarcasterMiniApp!.publishCast(text, options)
    } catch (error) {
      console.error("Failed to publish cast:", error)
      return ""
    }
  }

  // Открытие профиля пользователя
  public openProfile(fid: number) {
    if (!this.isAvailable()) {
      console.warn("Farcaster Mini App SDK is not available")
      return
    }

    window.FarcasterMiniApp!.openProfile(fid)
  }

  // Открытие каста
  public openCast(castHash: string) {
    if (!this.isAvailable()) {
      console.warn("Farcaster Mini App SDK is not available")
      return
    }

    window.FarcasterMiniApp!.openCast(castHash)
  }

  // Добавление приложения в избранное
  public async addMiniApp(): Promise<boolean> {
    if (!this.isAvailable()) {
      console.warn("Farcaster Mini App SDK is not available")
      return false
    }

    try {
      return await window.FarcasterMiniApp!.addMiniApp()
    } catch (error) {
      console.error("Failed to add mini app:", error)
      return false
    }
  }
}

// Экспортируем экземпляр клиента
export const farcasterMiniApp = new FarcasterMiniAppClient()
