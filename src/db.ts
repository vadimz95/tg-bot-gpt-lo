import { Pool } from 'pg';
import { config } from './config';

export const pool = new Pool({
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
});

export async function waitForDb(maxRetries = 10, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ PostgreSQL ready');
      return;
    } catch (err) {
      console.log(`⏳ PostgreSQL not ready, retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('❌ Cannot connect to PostgreSQL after retries');
}

export async function query(text: string, params?: any[]) {
    
  return pool.query(text, params);
}
