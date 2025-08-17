import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import sharp from 'sharp';
import { minify as minifyHTML } from 'html-minifier-terser';
import { minify as minifyJS } from 'terser';

const MAX_SIZE = 13312; // 13 KB
const MIN_PNG_QUALITY = 10; // don’t go below 10% quality

async function createZip() {
  let pngQuality = 30; // starting PNG quality

  async function buildZip() {
    const output = fs.createWriteStream('game.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);

    archive.on('error', err => { throw err; });

    // ----------------------
    // HTML
    // ----------------------
    const html = fs.readFileSync('dist/index.html', 'utf8');
    const minifiedHTML = await minifyHTML(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true
    });
    archive.append(minifiedHTML, { name: 'index.html' });

    // ----------------------
    // JS
    // ----------------------
    const jsCode = fs.readFileSync('dist/bundle.js', 'utf8');
    const minifiedJS = await minifyJS(jsCode, {
      compress: { drop_console: true, drop_debugger: true, passes: 3, unsafe: true, unsafe_arrows: true, toplevel: true },
      mangle: { toplevel: true },
      format: { comments: false }
    });
    archive.append(minifiedJS.code, { name: 'bundle.js' });

    // ----------------------
    // PNGs
    // ----------------------
    const files = fs.readdirSync('dist');
    for (const file of files) {
      if (file.endsWith('.png')) {
        const inputPath = path.join('dist', file);
        archive.append(
          await sharp(inputPath)
            .png({ compressionLevel: 9, quality: pngQuality })
            .toBuffer(),
          { name: file }
        );
      }
    }

    await archive.finalize();

    return new Promise(resolve => {
      output.on('close', () => {
        const bytesUsed = archive.pointer();
        resolve(bytesUsed);
      });
    });
  }

  // ----------------------
  // Try building until under limit
  // ----------------------
  let bytesUsed = await buildZip();
  while (bytesUsed > MAX_SIZE && pngQuality > MIN_PNG_QUALITY) {
    console.log(`⚠️ ZIP too large (${bytesUsed} bytes). Reducing PNG quality: ${pngQuality} -> ${pngQuality - 5}`);
    pngQuality -= 5;
    bytesUsed = await buildZip();
  }

  const percentUsed = (bytesUsed / MAX_SIZE * 100).toFixed(2);
  console.log(`✅ ZIP finalized: ${bytesUsed} bytes (${percentUsed}% of limit, PNG quality: ${pngQuality}%)`);

  if (bytesUsed > MAX_SIZE) {
    console.warn(`⚠️ Could not fit ZIP under ${MAX_SIZE} bytes, consider removing files.`);
  }
}

// Run
createZip().catch(err => console.error('❌ Error creating ZIP:', err));
