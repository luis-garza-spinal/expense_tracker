import { Result, ok, err } from '../../../shared/types/result';
import { isValidAmount, isNonEmptyString } from '../../../shared/utils/validators';
import { Expense, CreateExpenseInput } from '../types/expense';
import { ExpenseRepository, createExpenseRepository } from '../repositories/expenseRepository';
import { BalanceService, createBalanceService } from '../../balance/services/balanceService';

export type ExpenseError = 'INVALID_AMOUNT' | 'MISSING_FIELDS' | 'NETWORK_ERROR' | 'UNKNOWN';
export type ExpenseDeleteError = Omit<ExpenseError, 'INVALID_AMOUNT' | 'MISSING_FIELDS'>

type ReportPeriod = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export interface ExpenseService {
  addExpense(userId: string, input: CreateExpenseInput): Promise<Result<Expense, ExpenseError>>;
  getExpenses(userId: string): Promise<Result<Expense[], ExpenseError>>;
  getExpensesByPeriod(userId: string, period: ReportPeriod): Promise<Result<Expense[], ExpenseError>>;
  deleteExpenseById(userId: string, expenseId: string): Promise<Result<null, ExpenseDeleteError>>;
}

function getDateRange(period: ReportPeriod): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start: Date;

  switch (period) {
    case 'daily':
      start = now;
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
  }

  return { start: start.toISOString().split('T')[0], end };
}

function validateInput(input: CreateExpenseInput): ExpenseError | null {
  if (!isValidAmount(input.amount)) return 'INVALID_AMOUNT';

  const missingFields =
    !isNonEmptyString(input.category) || !isNonEmptyString(input.date);
  if (missingFields) return 'MISSING_FIELDS';

  return null;
}

function mapError(error: unknown): ExpenseError {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message.toLowerCase();
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
      return 'NETWORK_ERROR';
    }
  }
  return 'UNKNOWN';
}

function mapErrorDeleteError(error: unknown): ExpenseDeleteError {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message.toLowerCase();
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
      return 'NETWORK_ERROR';
    }
  }
  return 'UNKNOWN';
}

export function createExpenseService(
  repo?: ExpenseRepository,
  balanceSvc?: BalanceService
): ExpenseService {
  const expenseRepo = repo ?? createExpenseRepository();
  const balanceService = balanceSvc ?? createBalanceService();

  return {
    async addExpense(
      userId: string,
      input: CreateExpenseInput
    ): Promise<Result<Expense, ExpenseError>> {
      const validationError = validateInput(input);
      if (validationError) return err(validationError);

      try {
        const expense = await expenseRepo.create(userId, input);
        // Deduct from balance
        await balanceService.deductBalance(userId, input.amount);
        return ok(expense);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async getExpenses(userId: string): Promise<Result<Expense[], ExpenseError>> {
      try {
        const expenses = await expenseRepo.getByUserId(userId);
        return ok(expenses);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async getExpensesByPeriod(
      userId: string,
      period: ReportPeriod
    ): Promise<Result<Expense[], ExpenseError>> {
      try {
        const { start, end } = getDateRange(period);
        const expenses = await expenseRepo.getByDateRange(userId, start, end);
        return ok(expenses);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async deleteExpenseById(userId: string, expenseId: string): Promise<Result<null, ExpenseDeleteError>>{
      try{
        await expenseRepo.deleteExpenseById(userId, expenseId);
        return ok(null);
      }catch(error){
        return err(mapErrorDeleteError(error))
      }
    }
  };
}
