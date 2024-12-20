import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../src/levels/level_1.csv');
const outputPath = join(__dirname, '../src/levels/level_1.json');

function createGridFromCsv(filepath: string): number[][] {
  const fileContent = readFileSync(filepath, 'utf-8');
  return fileContent
    .trim()
    .split('\n')
    .map((row) => row.split(',').map((cell) => parseInt(cell, 10)));
}

try {
  const grid = createGridFromCsv(inputPath);
  writeFileSync(outputPath, JSON.stringify(grid, null, 2));
  console.log(`Level data processed and saved to ${outputPath}`);
} catch (error) {
  console.error('Error processing level data:', error);
  process.exit(1);
}