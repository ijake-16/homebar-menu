#!/bin/bash

echo "Installing pnpm..."
npm install -g pnpm

echo "Cleaning up old node_modules if present..."
rm -rf node_modules

echo "Installing dependencies..."
pnpm install --force

echo "Adding additional dependencies..."
pnpm add -D esbuild lightningcss

# Create a temporary Vite config that explicitly binds to all interfaces
echo "Creating Vite config with network binding..."
cat > vite.config.js << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173
    }
  }
});
EOF

echo "Starting development server..."
pnpm run dev 