import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = './attached_assets';
const OUTPUT_DIR = './attached_assets/optimized';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const galleryImages = [
  'LS2C6649_1766230961643.jpg',
  'LS2C6650_1766230961643.jpg',
  'LS2C6651_1766230961643.jpg',
  'LS2C6652_1766230961644.jpg',
  'LS2C6653_1766230961644.jpg',
  'LS2C6654_1766230961644.jpg',
  'LS2C6667_1766230961644.jpg',
  'LS2C6668_1766230961644.jpg',
  'LS2C6669_1766230961645.jpg',
  'LS2C6649_1766386247799.jpg',
  'DAMO_FAMA-3_1766384989330.png'
];

async function compressImage(filename) {
  const inputPath = path.join(SOURCE_DIR, filename);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size / (1024 * 1024);

    await sharp(inputPath)
      .resize(1600, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size / (1024 * 1024);

    console.log(`${filename}: ${originalSize.toFixed(2)}MB -> ${newSize.toFixed(2)}MB (${((1 - newSize/originalSize) * 100).toFixed(0)}% reduction)`);
  } catch (error) {
    console.error(`Error compressing ${filename}:`, error.message);
  }
}

async function main() {
  console.log('Compressing gallery images...\n');
  
  for (const image of galleryImages) {
    await compressImage(image);
  }
  
  console.log('\nDone! Optimized images saved to', OUTPUT_DIR);
}

main();
