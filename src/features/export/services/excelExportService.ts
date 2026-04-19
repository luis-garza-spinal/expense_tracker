import { Result, ok, err } from '../../../shared/types/result';
import { ReportSummary } from '../../dashboard/types/report';

export type ExportError = 'GENERATION_FAILED' | 'FILE_WRITE_ERROR' | 'UNKNOWN';

export interface ExcelExportService {
  generateXlsx(report: ReportSummary): Promise<Result<string, ExportError>>;
}

export function createExcelExportService(): ExcelExportService {
  return {
    async generateXlsx(report: ReportSummary): Promise<Result<string, ExportError>> {
      try {
        const XLSX = require('xlsx');
        const RNFS = require('react-native-fs');
        const { default: Share } = require('react-native-share');

        // Expense data sheet
        const expenseData = report.expenses.map((e) => ({
          Date: e.date,
          Category: e.category,
          Amount: e.amount,
          Description: e.description ?? '',
        }));
        const expenseSheet = XLSX.utils.json_to_sheet(expenseData);

        // Summary sheet
        const summaryData = [
          { Label: 'Period', Value: report.period },
          { Label: 'Start Date', Value: report.startDate },
          { Label: 'End Date', Value: report.endDate },
          { Label: 'Total Expenses', Value: report.totalExpenses },
          { Label: '', Value: '' },
          { Label: 'Category', Value: 'Total' },
          ...report.categoryBreakdown.map((c) => ({
            Label: c.category,
            Value: c.total,
          })),
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);

        // Build workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Write to file
        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const fileName = `expensy-report-${report.period}-${report.startDate}.xlsx`;
        const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        await RNFS.writeFile(filePath, wbout, 'base64');

        await Share.open({
          url: `file://${filePath}`,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        return ok(filePath);
      } catch (error) {
        const msg = error instanceof Error ? error.message.toLowerCase() : '';
        if (msg.includes('file') || msg.includes('write') || msg.includes('permission')) {
          return err('FILE_WRITE_ERROR');
        }
        return err('GENERATION_FAILED');
      }
    },
  };
}
