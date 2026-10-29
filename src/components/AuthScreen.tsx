
import { useState } from 'react';
import { Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { DoodleXLogo } from '@/components/DoodleXLogo';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const inputClass =
    'w-full rounded-xl border border-ink-600/60 bg-ink-700/60 pl-11 pr-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-gray-600 focus:border-neon-cyan/50';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || !password) {
      setError('মোবাইল নম্বর ও পাসওয়ার্ড দিন।');
      return;
    }

    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (mode === 'signup' && !username.trim()) {
      setError('ইউজারনেম দিন।');
      return;
    }

    setBusy(true);

    try {
      const result =
        mode === 'login'
          ? await signIn(phone.trim(), password)
          : await signUp(phone.trim(), password, username.trim());

      if (result.error) setError(result.error);
    } catch {
      setError('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-ink-800 ring-1 ring-ink-600/60">
            <DoodleXLogo className="h-9 w-9" />
          </div>
          <span className="mt-3 font-display text-2xl font-bold tracking-tight">
            Doodle<span className="text-neon-cyan">X</span>
          </span>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
            Play &amp; Win
          </p>
        </div>

        <div className="mb-6 flex rounded-xl border border-ink-600/60 bg-ink-700/40 p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${
              mode === 'login' ? 'bg-ink-700 text-white' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${
              mode === 'signup' ? 'bg-ink-700 text-white' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your gamer name"
                  className={inputClass}
                  autoComplete="username"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className={inputClass}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className={inputClass}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-neon-red/30 bg-red-950/30 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-neon-red" />
              <p className="text-xs font-medium text-neon-red">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3.5 font-display text-base font-bold text-ink-900 disabled:opacity-50"
            style={{ boxShadow: '0 0 16px #22f0e655' }}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-gray-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="font-semibold text-neon-cyan hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
