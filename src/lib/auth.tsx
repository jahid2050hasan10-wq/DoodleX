
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    phone: string,
    password: string,
    username: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    phone: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, '');
}

// Internal email alias for Supabase Email Auth.
// This does NOT verify ownership of the phone number.
function phoneToEmail(phone: string) {
  const digits = normalizePhone(phone).replace(/\D/g, '');
  return `phone-${digits}@login.doodlex.invalid`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return;
    }
    setProfile(data as Profile | null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        void fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(
    async (phone: string, password: string, username: string) => {
      const cleanPhone = normalizePhone(phone);
      const digits = cleanPhone.replace(/\D/g, '');

      if (digits.length < 8 || digits.length > 15) {
        return { error: 'Please enter a valid phone number.' };
      }
      if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
      }
      if (!username.trim()) {
        return { error: 'Please enter a username.' };
      }

      const { error } = await supabase.auth.signUp({
        email: phoneToEmail(cleanPhone),
        password,
        options: {
          data: {
            username: username.trim(),
            phone: cleanPhone,
          },
        },
      });

      if (error) return { error: error.message };
      return { error: null };
    },
    []
  );

  const signIn = useCallback(async (phone: string, password: string) => {
    const cleanPhone = normalizePhone(phone);
    const digits = cleanPhone.replace(/\D/g, '');

    if (digits.length < 8 || digits.length > 15) {
      return { error: 'Please enter a valid phone number.' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(cleanPhone),
      password,
    });

    if (error) return { error: 'Phone number or password is incorrect.' };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
