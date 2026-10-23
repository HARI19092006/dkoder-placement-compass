import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the built site work on GitHub Pages sub-paths
export default defineConfig({ plugins: [react()], base: './' })