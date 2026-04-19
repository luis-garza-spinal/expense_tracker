import { Result, ok, err } from '../../../shared/types/result';
import { ReportSummary } from '../../dashboard/types/report';
import { generatePdfHtml } from '../templates/pdfTemplate';

export type ExportError = 'GENERATION_FAILED' | 'FILE_WRITE_ERROR' | 'UNKNOWN';

export interface PdfExportService {
  generatePdf(report: ReportSummary): Promise<Result<string, ExportError>>;
}

export function createPdfExportService(): PdfExportService {
  return {
    async generatePdf(report: ReportSummary): Promise<Result<string, ExportError>> {
      try {

        
        const html = generatePdfHtml(report);
          
        // Dynamic imports to avoid bundling issues in test environments
        const RNHTMLtoPDF = require('react-native-html-to-pdf');
        const { default: Share } = require('react-native-share');

        const options = {
          html,
          fileName: `expensy-report-${report.period}-${report.startDate}`,
          directory: 'Documents',
        };
          
        const file = await RNHTMLtoPDF.convert(options);
      
        if (!file.filePath) {
          return err('FILE_WRITE_ERROR');
        }

        await Share.open({ url: `file://${file.filePath}`, type: 'application/pdf' });

        return ok(file.filePath);
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
