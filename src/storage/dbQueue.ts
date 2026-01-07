import { query } from '../db';

type QueueItem = {
  sql: string;
  params?: any[];
  resolve: () => void;
  reject: (err: unknown) => void;
};

const queue: QueueItem[] = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const item = queue.shift()!;

  try {
    await query(item.sql, item.params);
    item.resolve();
  } catch (err) {
    item.reject(err);
  } finally {
    isProcessing = false;
    processQueue();
  }
}

export function enqueueQuery(sql: string, params?: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    queue.push({ sql, params, resolve, reject });
    processQueue();
  });
}
