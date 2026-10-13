import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  skin_depth?: string;
  undertone?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || '',
        });
      } else {
        // Check localStorage fallback for offline/guest profile
        const localUser = localStorage.getItem('glowguide_user');
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch {
            localStorage.removeItem('glowguide_user');
          }
        }
      }
      setIsLoading(false);
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || '',
        };
        setUser(profile);
        localStorage.setItem('glowguide_user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('glowguide_user');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      console.error('Google Sign-in Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('glowguide_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut }}>
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
