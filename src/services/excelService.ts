import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

const FILE_PATH = path.resolve('data', 'warehouse.xlsx');

export interface WarehouseItem {
  caption: string;
  photos: string[];
  createdAt: Date;
}

function ensureFileExists() {
  if (!fs.existsSync(path.dirname(FILE_PATH))) {
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  }
}

export async function saveItemToExcel(item: WarehouseItem) {
  ensureFileExists();

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
    worksheet = workbook.getWorksheet('Warehouse');
  }

  if (!worksheet) {
    worksheet = workbook.addWorksheet('Warehouse');
    worksheet.columns = [
      { header: 'Назва', key: 'caption', width: 30 },
      { header: 'Фото', key: 'photos', width: 80 },
      { header: 'Дата', key: 'createdAt', width: 25 },
    ];
  }

  worksheet.addRow({
    caption: item.caption,
    photos: item.photos.join(', '),
    createdAt: item.createdAt,
  });

  await workbook.xlsx.writeFile(FILE_PATH);
}
