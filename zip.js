import fs from 'fs';
import archiver from 'archiver';
import { minify } from 'html-minifier-terser';

async function createZip() {
  const output = fs.createWriteStream('game.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`ZIP erstellt: ${archive.pointer()} ≤ 13,312 bytes`);
  });

  archive.on('error', err => { throw err; });
  archive.pipe(output);

  const html = fs.readFileSync('dist/index.html', 'utf8');
  const minifiedHTML = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true
  });
  fs.writeFileSync('dist/index.min.html', minifiedHTML);
  archive.file('dist/index.min.html', { name: 'index.html' });

  // JS hinzufügen (optional vorher mit Terser minifizieren)
  archive.file('dist/bundle.js', { name: 'bundle.js' });

  await archive.finalize();
}

createZip().catch(console.error);