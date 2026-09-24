import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'iq.giftstore.app',
  appName: 'Gifty Plus',
  webDir: 'public',
  server: {
    // Points directly to the live production deployment
    // All real-time updates, server actions, authentication, and image uploads work natively
    url: 'https://gift-store-rl7i-three.vercel.app',
    cleartext: true,
    allowNavigation: [
      'gift-store-rl7i-three.vercel.app',
      '*.vercel.app',
      'api.whatsapp.com',
      'wa.me',
      '*.whatsapp.com'
    ]
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#13213c'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#13213c',
      showSpinner: true,
      spinnerColor: '#D97706',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      backgroundColor: '#13213c',
      style: 'DARK'
    }
  }
}

export default config
