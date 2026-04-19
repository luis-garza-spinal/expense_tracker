import { Result, ok, err } from '../../../shared/types/result';
import { Expense } from '../../expenses/types/expense';
import { ExpenseRepository, createExpenseRepository } from '../../expenses/repositories/expenseRepository';
import {
  ReportPeriod,
  CategoryBreakdown,
  ReportSummary,
  ExpenseSummary,
} from '../types/report';
import { getCalendars } from 'expo-localization'
import { toDate } from 'date-fns-tz'

const userTimeZone = getCalendars()[0].timeZone;

const parseDateWithUserTimeZone = (date: Date): string => {
  return toDate(date, { timeZone: userTimeZone ?? 'America/Mexico_City' }).toISOString().split('T')[0];
}

export type ReportError = 'NO_DATA' | 'NETWORK_ERROR' | 'UNKNOWN';

export interface ReportService {
  generateReport(userId: string, period: ReportPeriod, startDate: Date | null, endDate: Date | null): Promise<Result<ReportSummary, ReportError>>;
  calculateCategoryBreakdown(expenses: Expense[]): CategoryBreakdown[];
  getExpensesSummaryDetails(userId: string, startDate: Date, endDate: Date): Promise<Result<ExpenseSummary[], ReportError>>;
  getDateRange(period: ReportPeriod): { start: Date; end: Date }
}


export function calculateCategoryBreakdown(expenses: Expense[]): CategoryBreakdown[] {
  if (expenses.length === 0) return [];

  const totals = new Map<string, number>();
  let grandTotal = 0;

  for (const expense of expenses) {
    const current = totals.get(expense.category) ?? 0;
    totals.set(expense.category, current + expense.amount);
    grandTotal += expense.amount;
  }

  const breakdown: CategoryBreakdown[] = [];
  for (const [category, total] of totals) {
    breakdown.push({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    });
  }

  return breakdown;
}

function mapError(error: unknown): ReportError {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message.toLowerCase();
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
      return 'NETWORK_ERROR';
    }
  }
  return 'UNKNOWN';
}

export function createReportService(repo?: ExpenseRepository): ReportService {
  const expenseRepo = repo ?? createExpenseRepository();

  return {
    async generateReport(
      userId: string,
      period: ReportPeriod,
      startDate: Date,
      endDate: Date
    ): Promise<Result<ReportSummary, ReportError>> {
      try {
        const startString = parseDateWithUserTimeZone(startDate);
        const endString = parseDateWithUserTimeZone(endDate);

        const expenses = await expenseRepo.getByDateRange(userId, startString, endString);

        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const categoryBreakdown = calculateCategoryBreakdown(expenses);

        return ok({
          period,
          startDate: startString,
          endDate: endString,
          totalExpenses,
          categoryBreakdown,
          expenses,
        });
      } catch (error) {
        return err(mapError(error));
      }
    },

    getDateRange(period: ReportPeriod): { start: Date; end: Date } {
      const now = new Date();
      let start: Date;

      switch (period) {
        case 'daily':
          start = new Date(now);
          break;
        case 'weekly':
          start = new Date(now);
          start.setDate(start.getDate() - 7);
          break;
        case 'bi-weekly':
          start = new Date(now);
          start.setDate(start.getDate() - 14);
          break;
        case 'monthly':
          start = new Date(now);
          start.setMonth(start.getMonth() - 1);
          break;

        default:
          start = new Date();
      }
      return { start, end: now };
    },

    calculateCategoryBreakdown,


    async getExpensesSummaryDetails(userId: string, startDate: Date, endDate: Date): Promise<Result<ExpenseSummary[], ReportError>> {
      try {

        const start = parseDateWithUserTimeZone(startDate);
        const end = parseDateWithUserTimeZone(endDate);

        const expenses = await expenseRepo.getByDateRange(userId, start, end);

        // calculate total
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        // map to new type and calculate percentage based on total
        const newTypeArrayResult: ExpenseSummary[] = expenses.map((expense: Expense) => {
          return {
            ...expense,
            percentage: (expense.amount * 100) / totalExpenses
          }
        });

        return ok(newTypeArrayResult)
      } catch (error) {
        return err(mapError(error));
      }
    }
  };
}
