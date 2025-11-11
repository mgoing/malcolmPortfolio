import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  /* tailwindcss(), original to add this below*/ 

import rnw from 'vite-plugin-react-native-web'   // strips Flow, aliases, .web.js handling

export default defineConfig({
   base: '/',
  plugins: [react(), rnw(), tailwindcss()],
  resolve: {
    // force any import of 'react-native' to use react-native-web
    alias: {
      'react-native$': 'react-native-web', "@": path.resolve(__dirname, "./src")
    },
    // make .web.js resolve first if packages provide it
    extensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  ssr: {
    noExternal: ['react-native-web', '@react-native/normalize-colors']
  },
  optimizeDeps: {
    // prevent Vite's pre-bundler from trying to transform RN source (esbuild choke)
    exclude: ['react-native', 'react-native-web', '@react-native/normalize-colors']
  },
  build: {
    sourcemap: false, // disable in production unless you need them
    // rollupOptions: { /* add custom rollup options if required */ },
  },
})