import { ReportSummary } from '../../dashboard/types/report';

const PERIOD_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  monthly: 'Monthly',
};

export function generatePdfHtml(report: ReportSummary): string {
  const periodLabel = PERIOD_LABELS[report.period] ?? report.period;

  const categoryRows = report.categoryBreakdown
    .map(
      (c) =>
        `<tr>
          <td>${c.category}</td>
          <td>$${c.total.toFixed(2)}</td>
          <td>${c.percentage.toFixed(1)}%</td>
        </tr>`
    )
    .join('');

  const expenseRows = report.expenses
    .map(
      (e) =>
        `<tr>
          <td>${e.date}</td>
          <td>${e.category}</td>
          <td>$${e.amount.toFixed(2)}</td>
          <td>${e.description ?? ''}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #2D2D2D; }
    h1 { color: #E8879E; }
    h2 { color: #7BAEE0; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #FFF5F7; }
    .summary { margin: 16px 0; font-size: 18px; }
  </style>
</head>
<body>
  <h1>Expensy Report</h1>
  <p><strong>Period:</strong> ${periodLabel} (${report.startDate} — ${report.endDate})</p>
  <p class="summary"><strong>Total Expenses:</strong> $${report.totalExpenses.toFixed(2)}</p>

  <h2>Category Breakdown</h2>
  <table>
    <thead><tr><th>Category</th><th>Total</th><th>Percentage</th></tr></thead>
    <tbody>${categoryRows}</tbody>
  </table>

  <h2>Expense Details</h2>
  <table>
    <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr></thead>
    <tbody>${expenseRows}</tbody>
  </table>
</body>
</html>`;
}
