import fs from 'fs';
import archiver from 'archiver';
import { minify } from 'html-minifier-terser';
import path from 'path';
import sharp from 'sharp';

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

  const files = fs.readdirSync('dist');
  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join('dist', file);
      const buffer = await sharp(inputPath)
        .png({ compressionLevel: 10, quality: 30 }) // maximale Kompression, gute Qualität
        .toBuffer();
      archive.append(buffer, { name: file });
    }
  }

  await archive.finalize();
}

createZip().catch(console.error);