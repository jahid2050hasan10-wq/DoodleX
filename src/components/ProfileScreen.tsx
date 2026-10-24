import { Wallet, Trophy, Calendar, LogOut, User as UserIcon, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!profile) return null;

  const winRate = profile.matches_played > 0
    ? Math.round((profile.matches_won / profile.matches_played) * 100)
    : 0;

  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const { error } = await supabase
      .from('profiles')
      .update({ username, phone })
      .eq('id', profile.id);
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    await refreshProfile();
    setEditing(false);
    setSaving(false);
  };

  const inputClass =
    'w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors placeholder:text-gray-600 focus:border-neon-cyan/50';

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-600/60 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-700 p-6">
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-neon-cyan/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-pink/30">
            <span className="font-display text-2xl font-bold text-white">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Username"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="Phone number"
                />
                {error && <p className="text-xs text-neon-red">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-neon-cyan px-4 py-2 text-xs font-bold text-ink-900"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setError(''); }}
                    className="rounded-lg border border-ink-600 px-4 py-2 text-xs font-bold text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-white">
                  {profile.username}
                </h2>
                <p className="truncate text-sm text-gray-400">{user?.email}</p>
                {profile.phone && (
                  <p className="text-xs text-gray-500">{profile.phone}</p>
                )}
                <button
                  onClick={() => { setEditing(true); setUsername(profile.username); setPhone(profile.phone); }}
                  className="mt-1 flex items-center gap-1 text-xs font-medium text-neon-cyan hover:underline"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-ink-600/60 bg-ink-700/50 p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-neon-green/15">
            <Wallet className="h-4 w-4 text-neon-green" />
          </div>
          <p className="font-display text-xl font-bold text-white">৳ {profile.balance}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Balance</p>
        </div>
        <div className="rounded-2xl border border-ink-600/60 bg-ink-700/50 p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-neon-cyan/15">
            <Trophy className="h-4 w-4 text-neon-cyan" />
          </div>
          <p className="font-display text-xl font-bold text-white">
            {profile.matches_won}/{profile.matches_played}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Won/Played</p>
        </div>
        <div className="rounded-2xl border border-ink-600/60 bg-ink-700/50 p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-neon-pink/15">
            <UserIcon className="h-4 w-4 text-neon-pink" />
          </div>
          <p className="font-display text-xl font-bold text-white">{winRate}%</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">Win Rate</p>
        </div>
      </div>

      {/* Account info */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-400">Joined</span>
          <span className="ml-auto text-sm font-medium text-white">{joinedDate}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-400">Status</span>
          <span
            className="ml-auto rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: profile.status === 'active' ? '#39ff8a22' : '#ff4d5e22',
              color: profile.status === 'active' ? '#39ff8a' : '#ff4d5e',
            }}
          >
            {profile.status}
          </span>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-neon-red/30 bg-neon-red/10 py-3 font-display text-sm font-bold text-neon-red transition-all hover:bg-neon-red/20"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
