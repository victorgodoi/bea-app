import { Session } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface User {
  id?: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUserFromSession = (session: Session | null) => {
    if (session?.user) {
      setUserState({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
      });
    } else {
      setUserState(null);
    }
  };

  useEffect(() => {
    // Restaura sessão existente ao abrir o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserFromSession(session);
      setIsLoading(false);
    });

    // Sincroniza com mudanças de autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setUser = (newUser: User | null) => {
    // Mantido para compatibilidade — a sessão Supabase é a fonte de verdade
    setUserState(prev => newUser && prev ? { ...prev, ...newUser } : newUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
