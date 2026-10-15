import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'robots.txt', 'cv.pdf'],
      manifest: false,
      manifestFilename: 'manifest.webmanifest',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,png,webp,jpg,jpeg}'],
        // Yalnızca case study'de görünen galeri/video görselleri her ziyaretçiye önbelleğe alınmasın.
        // Kiril/Vietnamca font alt kümeleri bu sitede hiç kullanılmaz; precache dışında tut.
        globIgnores: [
          '**/previews/noble/**',
          '**/media/**',
          '**/*-cyrillic*.woff2',
          '**/*-vietnamese*.woff2',
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/cv\.pdf$/, /^\/certificates\//, /^\/og-image\.png$/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://api.github.com',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-api',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 },
            },
          },
        ],
      },
    }),
    mode === 'analyze' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/]react-icons[\\/]/.test(id)) return 'vendor-icons';
          if (/[\\/]node_modules[\\/]framer-motion[\\/]/.test(id)) return 'vendor-motion';
          if (/[\\/]node_modules[\\/]@vercel[\\/]/.test(id)) return 'vendor-vercel';
          if (
            /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|@remix-run|use-sync-external-store)[\\/]/.test(
              id,
            )
          ) {
            return 'vendor-react';
          }
          return 'vendor-common';
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'esnext',
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
}));
