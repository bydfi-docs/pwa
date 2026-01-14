import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/pwa/', // GitHub Pages 项目路径部署
  server: {
    host: '0.0.0.0', // 监听所有地址，包括 127.0.0.1 和 localhost
    port: 5173,
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
    open: true, // 启动时自动打开浏览器
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: '交易所 Demo - 数字货币交易平台',
        short_name: '交易所',
        description: '一个简洁美观的数字货币交易所 PWA 演示应用，支持行情查看、快捷交易和资产管理',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['finance', 'business'],
        screenshots: [
          {
            src: 'screenshots/home.png',
            sizes: '540x960',
            type: 'image/png',
            form_factor: 'narrow',
            label: '首页 - 市场行情'
          },
          {
            src: 'screenshots/market.png',
            sizes: '540x960',
            type: 'image/png',
            form_factor: 'narrow',
            label: '行情 - 实时数据'
          },
          {
            src: 'screenshots/trade.png',
            sizes: '540x960',
            type: 'image/png',
            form_factor: 'narrow',
            label: '交易 - 快捷买卖'
          },
          {
            src: 'screenshots/assets.png',
            sizes: '540x960',
            type: 'image/png',
            form_factor: 'narrow',
            label: '资产 - 数字钱包'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
})
