import { defineConfig } from 'vite';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    rollupOptions: {
      treeshake: true,
      output: {
        entryFileNames: 'bundle.js',
        compact: true
      },
      plugins: [
        terser({
          format: { comments: false },
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 3, // mehrfache Optimierungsdurchläufe
            pure_getters: true,
            unsafe: true, // aggressive Optimierung
            unsafe_arrows: true,
            unsafe_methods: true,
            unsafe_proto: true
          }
        })
      ]
    },
    minify: 'terser',
    outDir: 'dist',
    assetsDir: '',
    terserOptions: {
      format: { comments: false },
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 20,
        pure_getters: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true
      }
    },
    target: 'esnext'
  },
  esbuild: {
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  server: {
    port: 5173
  },
  optimizeDeps: {
    esbuildOptions: {
      treeShaking: true
    }
  }
});
