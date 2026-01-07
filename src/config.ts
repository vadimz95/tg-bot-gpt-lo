import 'dotenv/config';
import path from 'node:path';

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN as string,

  dataDir: path.resolve('data'),
  photosDir: path.resolve('data/photos'),
  excelPath: path.resolve('data/warehouse.xlsx'),
};

if (!config.telegramToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is missing');
}
