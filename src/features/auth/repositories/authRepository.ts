import { AuthResponse, Session, Subscription, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../../config/supabase';

export interface AuthResult {
  user: User | null;
  session: Session | null;
}

export interface AuthRepository {
  signUp(email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  onAuthStateChange(
    callback: (session: Session | null) => void
  ): { subscription: Subscription };
}

export function createAuthRepository(): AuthRepository {
  const supabase = getSupabaseClient();

  return {
    async signUp(email: string, password: string): Promise<AuthResult> {
      const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { user: data.user, session: data.session };
    },

    async signIn(email: string, password: string): Promise<AuthResult> {
      const { data, error }: AuthResponse =
        await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: data.user, session: data.session };
    },

    async signOut(): Promise<void> {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    async getSession(): Promise<Session | null> {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },

    onAuthStateChange(
      callback: (session: Session | null) => void
    ): { subscription: Subscription } {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
      });
      return { subscription: data.subscription };
    },
  };
}
