'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '../../lib/supabase-client';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const MOCK_AUTH_KEY = 'tech-wizard-admin-authenticated';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(Boolean(data.session));
      } else {
        setIsAuthenticated(window.localStorage.getItem(MOCK_AUTH_KEY) === 'true');
      }
      setIsLoading(false);
    }
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && pathname !== '/admin/login') router.replace('/admin/login');
    if (isAuthenticated && pathname === '/admin/login') router.replace('/admin/dashboard');
  }, [isAuthenticated, isLoading, pathname, router]);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    isLoading,
    async signIn(email: string, password: string) {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        window.localStorage.setItem(MOCK_AUTH_KEY, 'true');
      }
      setIsAuthenticated(true);
      router.replace('/admin/dashboard');
    },
    async signOut() {
      if (isSupabaseConfigured) await supabase.auth.signOut();
      window.localStorage.removeItem(MOCK_AUTH_KEY);
      setIsAuthenticated(false);
      router.replace('/admin/login');
    },
  }), [isAuthenticated, router]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
