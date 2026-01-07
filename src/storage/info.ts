import fs from 'node:fs';
import path from 'node:path';

export function saveInfo(
  dir: string,
  data: Record<string, unknown>
) {
  const filePath = path.join(dir, 'info.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
