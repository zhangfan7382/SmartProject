import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'


// 判断是否 GitHub Pages 环境（传入环境变量）
const isGitHubPages = process.env.DEPLOY_TARGET === 'GH_PAGES'

export default defineConfig({
  base: isGitHubPages ? '/SmartProject/' : '/', // 根据部署目标切换 base
  // base: '/SmartProject/', // 根据部署目标切换 base
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',  // 允许局域网访问
    port: 5173,       // 指定端口
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
