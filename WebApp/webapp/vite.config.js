import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/client': 'http://localhost:5000',
            '/mortgage_records': 'http://localhost:5000/',
            '/web_users': 'http://localhost:5000/'
        },
    },
})
