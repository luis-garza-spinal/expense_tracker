import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createAuthService, AuthService, AuthError } from '../../features/auth/services/authService';
import { createAuthRepository } from '../../features/auth/repositories/authRepository';
import { Result } from '../../shared/types/result';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<Result<User, AuthError>>;
  signIn: (email: string, password: string) => Promise<Result<User, AuthError>>;
  signOut: () => Promise<Result<void, AuthError>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  authService?: AuthService;
}

export function AuthProvider({ children, authService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const service = authService ?? createAuthService();

  useEffect(() => {
    // Check initial session
    service.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Listen for auth state changes
    const repo = createAuthRepository();
    const { subscription } = repo.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string) => {
      const result = await service.signUp(email, password);
      if (result.ok) setUser(result.data);
      return result;
    },
    [service]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const result = await service.signIn(email, password);
      if (result.ok) setUser(result.data);
      return result;
    },
    [service]
  );

  const signOut = useCallback(async () => {
    const result = await service.signOut();
    if (result.ok) setUser(null);
    return result;
  }, [service]);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
