import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/app/task/',
    plugins: [react()],
    server: {
      host: env.VITE_HOST || true,
      port: parseInt(env.VITE_PORT) || 3006
    }
  }
})
