export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  nitro: {
    devProxy: {
      '/api/': {
        target: 'http://localhost:5555',
        changeOrigin: true
      }
    }
  }
})