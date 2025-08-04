import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // Development server configuration
    server: {
      host: '0.0.0.0',  // Accessible on all network interfaces
      port: 5173,
      strictPort: true,  // Don't fall back to other ports
      open: true,        // Open browser automatically
      cors: true,        // Enable CORS for development
      
      // WebSocket configuration for HMR
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173
      },
      
      // Proxy configuration for API requests
      // vite.config.js  (only the proxy section shown)
proxy: {
  '/api': {
    // 1️⃣  Always forward to Apache on *localhost* so
    //     React + API share the same origin in dev.
    target: 'http://localhost/Sunleaf-Tech/api',

    changeOrigin: true,          // keeps Host header correct
    secure: false,               // dev is plain HTTP
    ws: false,                   // no WebSocket endpoints in PHP
    rewrite: path => path.replace(/^\/api/, ''),

    // 2️⃣  No extra headers needed. Dropping the
    //     X‑Forwarded‑Proto: https line avoids PHP deciding
    //     to mark the session cookie “Secure”, which would
    //     block it on http://localhost in Chrome.
  },
},

    },

    // Production build configuration
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'lodash'],
            ui: ['react-icons', 'react-toastify', 'react-hot-toast']
          }
        }
      }
    },

    // Path aliases for cleaner imports
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url))
      }
    },

    // Environment variables exposed to client
    define: {
      'process.env': {
        VITE_API_BASE_URL: JSON.stringify(env.VITE_API_BASE_URL),
        VITE_ENABLE_ANALYTICS: JSON.stringify(env.VITE_ENABLE_ANALYTICS),
        VITE_SENTRY_DSN: JSON.stringify(env.VITE_SENTRY_DSN),
        VITE_MODE: JSON.stringify(mode)
      }
    },

    // CSS and SCSS configuration
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: mode === 'production' 
          ? '[hash:base64:8]' 
          : '[name]__[local]--[hash:base64:5]'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_variables.scss";
            @import "@/styles/_mixins.scss";
          `
        }
      }
    }
  };
});