import fs from 'node:fs';
import XLSX from 'xlsx';
import { config } from '../config';

const SHEET_NAME = 'Warehouse';

export interface WarehouseRow {
  date: string;     // dd.mm.yyyy
  user: string;
  caption: string;
}

export function appendRow(row: WarehouseRow) {
  let workbook: XLSX.WorkBook;
  let worksheet: XLSX.WorkSheet;
  let data: any[][];

  if (fs.existsSync(config.excelPath)) {
    workbook = XLSX.readFile(config.excelPath);
    worksheet = workbook.Sheets[SHEET_NAME];
    data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  } else {
    workbook = XLSX.utils.book_new();
    data = [['№', 'Date', 'User', 'Caption']];
    worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
  }

  const lastIndex =
    data.length > 1 ? Number(data[data.length - 1][0]) : 0;

  const nextIndex = lastIndex + 1;

  data.push([
    nextIndex,
    row.date,
    row.user,
    row.caption,
  ]);

  const newSheet = XLSX.utils.aoa_to_sheet(data);
  workbook.Sheets[SHEET_NAME] = newSheet;

  XLSX.writeFile(workbook, config.excelPath);
}
