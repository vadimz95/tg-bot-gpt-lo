import fs from 'node:fs';
import { config } from '../config';

export function ensureDirectories() {
  if (!fs.existsSync(config.dataDir)) {
    fs.mkdirSync(config.dataDir);
  }

  if (!fs.existsSync(config.photosDir)) {
    fs.mkdirSync(config.photosDir);
  }
}
