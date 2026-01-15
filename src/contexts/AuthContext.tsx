import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  cvCredits: number;
  lmCredits: number;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshCredits: (userId?: string) => Promise<{ cvCredits: number; lmCredits: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cvCredits, setCvCredits] = useState(0);
  const [lmCredits, setLmCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCredits = async (userId?: string): Promise<{ cvCredits: number; lmCredits: number }> => {
    if (!supabase) {
      setCvCredits(0);
      setLmCredits(0);
      return { cvCredits: 0, lmCredits: 0 };
    }

    const resolvedUserId = userId ?? user?.id;
    if (!resolvedUserId) {
      setCvCredits(0);
      setLmCredits(0);
      return { cvCredits: 0, lmCredits: 0 };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('cv_credits, lm_credits')
      .eq('id', resolvedUserId)
      .single();

    if (error) {
      console.warn('Credit fetch warning:', error.message);
      return { cvCredits, lmCredits };
    }

    const nextCvCredits = typeof data?.cv_credits === 'number' ? data.cv_credits : 0;
    const nextLmCredits = typeof data?.lm_credits === 'number' ? data.lm_credits : 0;
    setCvCredits(nextCvCredits);
    setLmCredits(nextLmCredits);
    return { cvCredits: nextCvCredits, lmCredits: nextLmCredits };
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Récupérer la session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void refreshCredits(session.user.id);
      } else {
        setCvCredits(0);
        setLmCredits(0);
      }
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        void refreshCredits(session.user.id);
      } else {
        setCvCredits(0);
        setLmCredits(0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      setCvCredits(0);
      setLmCredits(0);
    }
  };

  return (
    <AuthContext.Provider value={{ user, cvCredits, lmCredits, signOut, loading, refreshCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Si Supabase n'est pas configuré, on renvoie un mock safe pour éviter les crashs
    return {
      user: null,
      cvCredits: 0,
      lmCredits: 0,
      signOut: async () => {},
      loading: false,
      refreshCredits: async (_userId?: string) => ({ cvCredits: 0, lmCredits: 0 })
    };
  }
  return context;
};
