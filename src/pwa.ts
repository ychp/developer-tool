/// <reference types="vite-plugin-pwa/client" />

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('新版本可用，是否立即更新？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('应用已准备好离线使用')
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    console.log('Service Worker 已注册', registration)
    
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error: unknown) {
    console.error('Service Worker 注册失败', error)
  }
})

export { updateSW }
