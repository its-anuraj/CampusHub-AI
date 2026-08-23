/**
 * Universal Data Export Utilities for CampusHub AI
 */

export function exportToCSV(filename: string, rows: Record<string, any>[], customHeaders?: string[]) {
  if (!rows || !rows.length) return;

  const keys = Object.keys(rows[0]);
  const headers = customHeaders || keys;

  const csvRows: string[] = [];
  csvRows.push(headers.join(','));

  for (const row of rows) {
    const values = keys.map((k) => {
      const val = row[k] === null || row[k] === undefined ? '' : String(row[k]);
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/\.csv$/, '')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(filename: string, data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/\.json$/, '')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
