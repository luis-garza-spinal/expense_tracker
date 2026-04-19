import { Expense } from '../../expenses/types/expense';

export type ReportPeriod = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'not-selected';

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
}

export interface ReportSummary {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  expenses: Expense[];
}

export interface ExpenseSummary {  
  id: string;
  amount: number
  category: string;
  date: string;
  description?: string;
  percentage: number;
}