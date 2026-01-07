import { WarehouseRow, appendRow } from './excel';

type QueueItem = {
  row: WarehouseRow;
  resolve: () => void;
  reject: (err: unknown) => void;
};

const queue: QueueItem[] = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing) return;
  if (queue.length === 0) return;

  isProcessing = true;

  const item = queue.shift()!;

  try {
    appendRow(item.row);
    item.resolve();
  } catch (err) {
    item.reject(err);
  } finally {
    isProcessing = false;
    processQueue();
  }
}

export function enqueueExcelWrite(row: WarehouseRow): Promise<void> {
  return new Promise((resolve, reject) => {
    queue.push({ row, resolve, reject });
    processQueue();
  });
}
