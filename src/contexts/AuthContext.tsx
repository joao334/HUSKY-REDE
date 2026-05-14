import type { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Profile } from '../types/domain';
import { dataService } from '../services/dataService';
import { isSupabaseConfigured, normalizeError, supabase } from '../services/supabase';
import { useToast } from './ToastContext';

type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithGoogle: (redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const ensureGoogleProfile = useCallback(async (user: User) => {
    if (!supabase) throw new Error('Supabase ainda não está configurado.');
    const metadata = user.user_metadata ?? {};
    const profilePayload = {
      id: user.id,
      name: String(metadata.full_name ?? metadata.name ?? user.email?.split('@')[0] ?? 'Cliente da Matilha'),
      email: user.email ?? '',
      phone: null,
      avatar_url: String(metadata.avatar_url ?? metadata.picture ?? '') || null,
      birth_date: null,
      neighborhood: null,
      bio: null,
      role: 'customer',
      points: 0,
      level: 'Filhote Husky',
    };
    const { error } = await supabase.from('users_profiles').insert(profilePayload);
    if (error && error.code !== '23505') throw error;
    return dataService.getProfile(user.id);
  }, []);

  const loadProfile = useCallback(async (user: User) => {
    try {
      const currentProfile = await dataService.getProfile(user.id);
      setProfile(currentProfile);
      return currentProfile;
    } catch (error) {
      if (!isSupabaseConfigured || !supabase) throw error;
      const createdProfile = await ensureGoogleProfile(user);
      setProfile(createdProfile);
      return createdProfile;
    }
  }, [ensureGoogleProfile]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        if (!isSupabaseConfigured || !supabase) {
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session && mounted) {
          setSession(data.session);
          await loadProfile(data.session.user);
        }
      } catch (error) {
        toast.error('Ops! A Husky tropeçou em algum ingrediente.', normalizeError(error));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    if (!supabase) return () => {
      mounted = false;
    };

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        try {
          await loadProfile(nextSession.user);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfile, toast]);

  const loginWithGoogle = useCallback(
    async (redirectPath = '/app/feed') => {
      setLoading(true);
      try {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error('Login Google ainda não está disponível neste ambiente.');
        }
        const target = redirectPath.startsWith('/') ? redirectPath : '/app/feed';
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}${target}`,
            queryParams: {
              prompt: 'select_account',
            },
          },
        });
        if (error) throw error;
      } catch (error) {
        toast.error('Não deu para entrar com Google', normalizeError(error));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const refreshProfile = useCallback(async () => {
    if (!profile) return;
    const next = await dataService.getProfile(profile.id);
    setProfile(next);
    if (!isSupabaseConfigured) localStorage.setItem('husky-current-profile', JSON.stringify(next));
  }, [profile]);

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem('husky-current-profile');
    setSession(null);
    setProfile(null);
    toast.info('Até logo', 'A matilha vai ficar te esperando.');
  }, [toast]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      isAuthenticated: Boolean(session && profile),
      isAdmin: profile?.role === 'admin',
      loginWithGoogle,
      logout,
      refreshProfile,
      setProfile,
    }),
    [loading, loginWithGoogle, logout, profile, refreshProfile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider.');
  return context;
}
