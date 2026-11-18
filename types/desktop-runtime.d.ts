declare global {
  interface Window {
    desktopRuntime?: {
      isElectron: boolean
      platform: string
      systemAudioLoopback: boolean
      backendBaseUrl: string
      captureScreenshot: () => Promise<string | null>
    }
  }
}

export {}
