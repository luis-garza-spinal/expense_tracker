import { Result, ok, err } from '../../../shared/types/result';
import { isValidAmount } from '../../../shared/utils/validators';
import { BalanceRepository, createBalanceRepository } from '../repositories/balanceRepository';

export type BalanceError = 'INVALID_AMOUNT' | 'NETWORK_ERROR' | 'UNKNOWN';

export interface BalanceService {
  getBalance(userId: string): Promise<Result<number, BalanceError>>;
  addBalance(userId: string, amount: number): Promise<Result<number, BalanceError>>;
  deductBalance(userId: string, amount: number): Promise<Result<number, BalanceError>>;
}

function mapError(error: unknown): BalanceError {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message.toLowerCase();
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
      return 'NETWORK_ERROR';
    }
  }
  return 'UNKNOWN';
}

export function createBalanceService(repo?: BalanceRepository): BalanceService {
  const balanceRepo = repo ?? createBalanceRepository();

  return {
    async getBalance(userId: string): Promise<Result<number, BalanceError>> {
      try {
        const balance = await balanceRepo.getBalance(userId);
        return ok(balance);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async addBalance(userId: string, amount: number): Promise<Result<number, BalanceError>> {
      if (!isValidAmount(amount)) {
        return err('INVALID_AMOUNT');
      }
      try {
        const current = await balanceRepo.getBalance(userId);
        const newBalance = current + amount;
        await balanceRepo.updateBalance(userId, newBalance);
        return ok(newBalance);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async deductBalance(userId: string, amount: number): Promise<Result<number, BalanceError>> {
      if (!isValidAmount(amount)) {
        return err('INVALID_AMOUNT');
      }
      try {
        const current = await balanceRepo.getBalance(userId);
        const newBalance = current - amount;
        await balanceRepo.updateBalance(userId, newBalance);
        return ok(newBalance);
      } catch (error) {
        return err(mapError(error));
      }
    },
  };
}
