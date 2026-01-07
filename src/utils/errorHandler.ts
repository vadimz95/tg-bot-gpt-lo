import fs from 'node:fs';
import path from 'node:path';

// Створюємо папку errors, якщо нема
const errorsDir = path.join(__dirname, '../../errors');
if (!fs.existsSync(errorsDir)) {
  fs.mkdirSync(errorsDir, { recursive: true });
}

export function logError(error: unknown, context?: string) {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/:/g, '-') // Windows safe
    .replace(/\..+/, ''); // видаляємо мілісекунди

  const fileName = `${context}-${timestamp}.txt`;
  const filePath = path.join(errorsDir, fileName);

  const content = [
    `Date: ${now.toISOString()}`,
    context ? `Context: ${context}` : '',
    `Error: ${error instanceof Error ? error.stack : String(error)}`,
  ].join('\n\n');

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`❌ Error saved to ${filePath}`);
  } catch (fsErr) {
    console.error('Cannot write error file', fsErr);
  }
}
