import { User } from '@supabase/supabase-js';
import { Result, ok, err } from '../../../shared/types/result';
import { AuthRepository, createAuthRepository } from '../repositories/authRepository';

export type AuthError =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export interface AuthService {
  signUp(email: string, password: string): Promise<Result<User, AuthError>>;
  signIn(email: string, password: string): Promise<Result<User, AuthError>>;
  signOut(): Promise<Result<void, AuthError>>;
  getCurrentUser(): Promise<User | null>;
}

function mapError(error: unknown): AuthError {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message: string }).message.toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
      return 'INVALID_CREDENTIALS';
    }
    if (msg.includes('already registered') || msg.includes('already been registered')) {
      return 'EMAIL_ALREADY_EXISTS';
    }
    if (msg.includes('password') && (msg.includes('short') || msg.includes('weak') || msg.includes('at least'))) {
      return 'WEAK_PASSWORD';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
      return 'NETWORK_ERROR';
    }
  }
  return 'UNKNOWN';
}

export function createAuthService(repo?: AuthRepository): AuthService {
  const authRepo = repo ?? createAuthRepository();

  return {
    async signUp(email: string, password: string): Promise<Result<User, AuthError>> {
      try {
        const { user } = await authRepo.signUp(email, password);
        if (!user) return err('UNKNOWN');
        return ok(user);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async signIn(email: string, password: string): Promise<Result<User, AuthError>> {
      try {
        const { user } = await authRepo.signIn(email, password);
        if (!user) return err('INVALID_CREDENTIALS');
        return ok(user);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async signOut(): Promise<Result<void, AuthError>> {
      try {
        await authRepo.signOut();
        return ok(undefined);
      } catch (error) {
        return err(mapError(error));
      }
    },

    async getCurrentUser(): Promise<User | null> {
      try {
        const session = await authRepo.getSession();
        return session?.user ?? null;
      } catch {
        return null;
      }
    },
  };
}
