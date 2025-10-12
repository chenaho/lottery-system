import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 自訂網域使用 '/'，GitHub Pages 預設網域使用 '/lottery-system/'
  // 可以透過環境變數 VITE_BASE_PATH 來控制
  base: process.env.VITE_BASE_PATH || '/',
})
