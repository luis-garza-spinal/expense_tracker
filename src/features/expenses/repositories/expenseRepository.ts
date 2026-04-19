import { getSupabaseClient } from '../../../config/supabase';
import { Expense, CreateExpenseInput } from '../types/expense';

export interface ExpenseRepository {
  create(userId: string, input: CreateExpenseInput): Promise<Expense>;
  getByUserId(userId: string): Promise<Expense[]>;
  getByDateRange(userId: string, start: string, end: string): Promise<Expense[]>;
  deleteExpenseById(userId: string, expenseId: string): Promise<void>;
}

function mapRow(row: Record<string, unknown>): Expense {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    amount: Number(row.amount),
    category: row.category as string,
    date: row.date as string,
    description: (row.description as string) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function createExpenseRepository(): ExpenseRepository {
  const supabase = getSupabaseClient();

  return {
    async create(userId: string, input: CreateExpenseInput): Promise<Expense> {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          amount: input.amount,
          category: input.category,
          date: input.date,
          description: input.description ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return mapRow(data);
    },

    async getByUserId(userId: string): Promise<Expense[]> {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return (data ?? []).map(mapRow);
    },

    async getByDateRange(userId: string, start: string, end: string): Promise<Expense[]> {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },

    async deleteExpenseById(userId: string, expenseId: string) {
      console.log(userId, expenseId)
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('user_id', userId)
        .eq('id', expenseId)
      if(error) throw error;
    }
  };
}
