import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';

export async function savePhotosToFolder(
  fileUrls: string[],
  targetDir: string
): Promise<string[]> {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const saved: string[] = [];

  for (let i = 0; i < fileUrls.length; i++) {
    const filePath = path.join(targetDir, `photo_${i + 1}.jpg`);
    const response = await axios.get(fileUrls[i], { responseType: 'stream' });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    saved.push(filePath);
  }

  return saved;
}
