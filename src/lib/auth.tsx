
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

function phoneToEmail(phone: string) {
  let digits = normalizePhone(phone).replace(/\D/g, '');

  // Convert Bangladeshi local numbers to one consistent format.
  if (digits.startsWith('8801') && digits.length === 13) {
    digits = digits.slice(2);
  } else if (digits.startsWith('01') && digits.length === 11) {
    digits = digits.slice(1);
  }

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
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('Session error:', error.message);
      }

      const currentSession = data.session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }

      if (mounted) setLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
      } else {
        setLoading(false);
        setTimeout(() => {
          if (mounted) {
            void fetchProfile(nextSession.user.id);
          }
        }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(
    async (phone: string, password: string, username: string) => {
      const digits = normalizePhone(phone).replace(/\D/g, '');

      if (digits.length < 8 || digits.length > 15) {
        return { error: 'সঠিক মোবাইল নম্বর দিন।' };
      }

      if (password.length < 6) {
        return { error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
      }

      if (!username.trim()) {
        return { error: 'ইউজারনেম দিন।' };
      }

      const { error } = await supabase.auth.signUp({
        email: phoneToEmail(phone),
        password,
        options: {
          data: {
            username: username.trim(),
            phone: normalizePhone(phone),
          },
        },
      });

      if (error) return { error: error.message };

      return { error: null };
    },
    []
  );

  const signIn = useCallback(async (phone: string, password: string) => {
    const digits = normalizePhone(phone).replace(/\D/g, '');

    if (digits.length < 8 || digits.length > 15) {
      return { error: 'সঠিক মোবাইল নম্বর দিন।' };
    }

    if (password.length < 6) {
      return { error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: phoneToEmail(phone),
      password,
    });

    if (error) {
      return { error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল।' };
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
