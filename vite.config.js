import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/nycu-cs-grad-check-113/',
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
