import * as XLSX from 'xlsx';

export function saveToExcel(caption: string, photos: string[]) {
  const filePath = './data.xlsx';

  let workbook;
  let sheet;

  try {
    workbook = XLSX.readFile(filePath);
    sheet = workbook.Sheets[workbook.SheetNames[0]];
  } catch {
    workbook = XLSX.utils.book_new();
    sheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Data');
  }

  const data = XLSX.utils.sheet_to_json(sheet);
  data.push({
    caption,
    photos: photos.join(', '),
    createdAt: new Date().toISOString(),
  });

  const newSheet = XLSX.utils.json_to_sheet(data);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;

  XLSX.writeFile(workbook, filePath);
}
