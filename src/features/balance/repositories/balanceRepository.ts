import { getSupabaseClient } from '../../../config/supabase';

export interface BalanceRepository {
  getBalance(userId: string): Promise<number>;
  updateBalance(userId: string, newBalance: number): Promise<void>;
}

export function createBalanceRepository(): BalanceRepository {
  const supabase = getSupabaseClient();

  return {
    async getBalance(userId: string): Promise<number> {
      const { data, error } = await supabase
        .from('balances')
        .select('amount')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No row found — create initial balance
        const { error: insertError } = await supabase
          .from('balances')
          .insert({ user_id: userId, amount: 0 });
        if (insertError) throw insertError;
        return 0;
      }

      if (error) throw error;
      return Number(data.amount);
    },

    async updateBalance(userId: string, newBalance: number): Promise<void> {
      const { error } = await supabase
        .from('balances')
        .upsert(
          { user_id: userId, amount: newBalance, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
    },
  };
}
