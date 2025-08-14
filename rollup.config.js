import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'Game'
  },
  plugins: [
    resolve(),
    terser(),
    copy({
      targets: [
        { src: 'index.html', dest: 'dist/' }, 
        { src: 'public/*', dest: 'dist/' }
      ]
    })
  ]
};