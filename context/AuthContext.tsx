import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { MOCK_USER } from '../constants';
import { showToast } from '../components/Toast';

// Basic HTML sanitizer for XSS protection
const sanitizeHTML = (str: string) => {
  if (!str) return str;
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
  isOnlineMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOnlineMode = isSupabaseConfigured();

  useEffect(() => {
    if (isOnlineMode && supabase) {
      const fetchProfileAndSetUser = async (user: any) => {
        const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
        if (!data) {
          await supabase.from('user_profiles').insert({ id: user.id });
        }
        setUser({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuária',
          email: user.email || '',
          avatarUrl: user.user_metadata?.avatar_url,
          subscriptionTier: data?.subscription_tier || 'free',
          bigFiveTrait: data?.big_five_trait || undefined,
          isAdmin: data?.is_admin || false
        });
        setIsLoading(false);
      };

      // Check existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchProfileAndSetUser(session.user);
        } else {
          setIsLoading(false);
        }
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchProfileAndSetUser(session.user);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline mode: use localStorage
      const storedUser = localStorage.getItem('tdah_app_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
      setIsLoading(false);
    }
  }, [isOnlineMode]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isOnlineMode && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Email ou senha incorretos.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Confirme seu email antes de entrar. Verifique sua caixa de entrada.' };
        }
        return { error: error.message };
      }
      return {};
    } else {
      // Offline mode: accept any credentials
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = { ...MOCK_USER, email };
          setUser(newUser);
          localStorage.setItem('tdah_app_user', JSON.stringify(newUser));
          resolve({});
        }, 500);
      });
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    if (isOnlineMode && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Este email já está cadastrado. Tente fazer login.' };
        }
        if (error.message.includes('Password should be')) {
          return { error: 'A senha deve ter pelo menos 6 caracteres.' };
        }
        return { error: error.message };
      }
      return {};
    } else {
      // Offline mode
      const newUser = { ...MOCK_USER, email, name };
      setUser(newUser);
      localStorage.setItem('tdah_app_user', JSON.stringify(newUser));
      return {};
    }
  };

  const logout = async () => {
    if (isOnlineMode && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('tdah_app_user');
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    if (isOnlineMode && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) return { error: error.message };
      return {};
    }
    return { error: 'Recuperação de senha não disponível no modo offline.' };
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    // Sanitize user inputs to prevent XSS
    const safeUpdates: Partial<User> = {};
    if (updates.name) safeUpdates.name = sanitizeHTML(updates.name);
    if (updates.avatarUrl) safeUpdates.avatarUrl = updates.avatarUrl; // Assuming URL safe
    if (updates.bigFiveTrait) safeUpdates.bigFiveTrait = updates.bigFiveTrait; // System handled
    if (updates.subscriptionTier) safeUpdates.subscriptionTier = updates.subscriptionTier; // System handled

    const updatedUser = { ...user, ...safeUpdates };
    setUser(updatedUser);
    localStorage.setItem('tdah_app_user', JSON.stringify(updatedUser));

    if (isOnlineMode && supabase) {
      try {
        const { error: authError } = await supabase.auth.updateUser({
          data: { name: updatedUser.name, avatar_url: updatedUser.avatarUrl },
        });

        if (authError) throw authError;

        if (safeUpdates.bigFiveTrait || safeUpdates.subscriptionTier) {
          const { error: profileError } = await supabase.from('user_profiles').update({
            big_five_trait: safeUpdates.bigFiveTrait,
            subscription_tier: safeUpdates.subscriptionTier
          }).eq('id', user.id);
          if (profileError) throw profileError;
        }
      } catch (e) {
        console.error('Failed to update user globally', e);
        showToast('Suas mudanças no perfil parecem não ter sido gravadas. Tente mais tarde.', 'error');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, updateUser, isLoading, isOnlineMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};