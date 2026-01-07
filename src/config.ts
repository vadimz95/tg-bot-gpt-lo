import 'dotenv/config';
import path from 'node:path';

function required(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }
  return value;
}

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN as string,

  dbHost: process.env.DB_HOST as string,
  dbPort: Number(process.env.DB_PORT ?? 5432),
  dbName: process.env.DB_NAME as string,
  dbUser: process.env.DB_USER as string,
  dbPassword: process.env.DB_PASSWORD as string,

  dataDir: path.resolve('data'),
  photosDir: path.resolve('data/photos'),
  excelPath: path.resolve('data/warehouse.xlsx'),
};

if (!config.telegramToken) {
  throw new Error('TELEGRAM_BOT_TOKEN is missing');
}
