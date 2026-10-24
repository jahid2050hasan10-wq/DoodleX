import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Plus, Check, X, Users as UsersIcon, Wallet, ArrowUpFromLine,
  ArrowDownToLine, Gamepad2, Search, CheckCircle2, XCircle, Loader2,
  Trash2, Edit3, Power, Megaphone, Ban, Pencil,
} from 'lucide-react';
import { supabase, type Profile, type PaymentRequestRow, type Game, type MatchRow, type Announcement } from '@/lib/supabase';
import CreateMatchModal from '@/components/CreateMatchModal';
import GameEditorModal from '@/components/GameEditorModal';
import GameThumbnail from '@/components/GameThumbnail';
import { useGames } from '@/lib/useGames';

type Tab = 'games' | 'matches' | 'deposits' | 'withdrawals' | 'users' | 'announcements';

const methodLabels: Record<string, string> = { bkash: 'bKash', nagad: 'Nagad', rocket: 'Rocket', upay: 'Upay' };

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-ink-600/60 bg-ink-700/50 p-4">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: `${color}1a` }}>{icon}</div>
      <p className="font-display text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}

function RequestCard({ req, username, onApprove, onReject }: { req: PaymentRequestRow; username: string; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const isDeposit = req.type === 'deposit';
  const accentColor = isDeposit ? '#39ff8a' : '#ff4d5e';
  const Icon = isDeposit ? ArrowDownToLine : ArrowUpFromLine;
  const date = new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  return (
    <div className="rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${accentColor}22` }}>
            <Icon className="h-4.5 w-4.5" style={{ color: accentColor }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{username}</p>
            <p className="text-[11px] text-gray-500">{methodLabels[req.method]} · {date}</p>
          </div>
        </div>
        <p className="font-display text-base font-bold" style={{ color: accentColor }}>৳ {req.amount}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
        <span>TxID: <span className="font-mono text-gray-400">{req.trx_id}</span></span>
        <span>{isDeposit ? 'Sender' : 'Recipient'}: <span className="font-mono text-gray-400">{req.sender_number}</span></span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-ink-600/50 pt-3">
        {req.status === 'pending' ? (
          <div className="flex flex-1 gap-2">
            <button onClick={() => onApprove(req.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neon-green/15 py-2 text-xs font-bold text-neon-green transition-colors hover:bg-neon-green/25">
              <Check className="h-3.5 w-3.5" />Approve
            </button>
            <button onClick={() => onReject(req.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neon-red/15 py-2 text-xs font-bold text-neon-red transition-colors hover:bg-neon-red/25">
              <X className="h-3.5 w-3.5" />Reject
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {req.status === 'approved' ? (
              <><CheckCircle2 className="h-4 w-4 text-neon-green" /><span className="text-xs font-semibold text-neon-green">Approved</span></>
            ) : (
              <><XCircle className="h-4 w-4 text-neon-red" /><span className="text-xs font-semibold text-neon-red">Rejected</span></>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminScreen() {
  const [tab, setTab] = useState<Tab>('games');
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [showGameEditor, setShowGameEditor] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingMatch, setEditingMatch] = useState<MatchRow | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [allRequests, setAllRequests] = useState<PaymentRequestRow[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const { games, refetch: refetchGames } = useGames();

  const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const fetchData = useCallback(async () => {
    const [reqRes, usersRes, matchRes, annRes] = await Promise.all([
      supabase.from('payment_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('matches').select('*').order('created_at', { ascending: false }),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    ]);
    if (reqRes.data) setAllRequests(reqRes.data as PaymentRequestRow[]);
    if (usersRes.data) setProfiles(usersRes.data as Profile[]);
    if (matchRes.data) setMatches(matchRes.data as MatchRow[]);
    if (annRes.data) setAnnouncements(annRes.data as Announcement[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'payment_requests' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  const handleApprove = async (id: string) => {
    await supabase.from('payment_requests').update({ status: 'approved' }).eq('id', id);
    await fetchData();
  };
  const handleReject = async (id: string) => {
    await supabase.from('payment_requests').update({ status: 'rejected' }).eq('id', id);
    await fetchData();
  };

  const handleSaveGame = async (game: Partial<Game>) => {
    if (game.id) {
      const { error } = await supabase.from('games').update(game).eq('id', game.id);
      if (error) throw new Error(error.message);
    } else {
      const maxOrder = games.reduce((max, g) => Math.max(max, g.sort_order), 0);
      const { error } = await supabase.from('games').insert({ ...game, sort_order: maxOrder + 1 });
      if (error) throw new Error(error.message);
    }
    await refetchGames();
  };

  const handleToggleGame = async (game: Game) => {
    await supabase.from('games').update({ is_active: !game.is_active }).eq('id', game.id);
    await refetchGames();
  };

  const handleDeleteGame = async (id: string) => {
    await supabase.from('games').delete().eq('id', id);
    setDeleteConfirmId(null);
    await refetchGames();
  };

  const handleCreateMatch = async (m: { gameId: string; label: string; mode: string; entryFee: number; firstPrize: number; secondPrize: number; slotsTotal: number }) => {
    await supabase.from('matches').insert({
      game_id: m.gameId, label: m.label, mode: m.mode,
      entry_fee: m.entryFee, first_prize: m.firstPrize, second_prize: m.secondPrize,
      slots_filled: 0, slots_total: m.slotsTotal, status: 'open',
    });
    await fetchData();
  };

  const handleSaveMatch = async (m: MatchRow) => {
    await supabase.from('matches').update({
      entry_fee: m.entry_fee, first_prize: m.first_prize, second_prize: m.second_prize,
      slots_total: m.slots_total, mode: m.mode, label: m.label,
    }).eq('id', m.id);
    setEditingMatch(null);
    await fetchData();
  };

  const handleDeleteMatch = async (id: string) => {
    await supabase.from('matches').delete().eq('id', id);
    setDeleteMatchId(null);
    await fetchData();
  };

  const handleBanUser = async (id: string, currentStatus: string) => {
    await supabase.from('profiles').update({ status: currentStatus === 'active' ? 'banned' : 'active' }).eq('id', id);
    await fetchData();
  };

  const handleCreateAnnouncement = async () => {
    if (!annTitle.trim() || !annBody.trim()) return;
    await supabase.from('announcements').insert({ title: annTitle.trim(), body: annBody.trim(), is_active: true });
    setAnnTitle(''); setAnnBody(''); setShowAnnouncementForm(false);
    await fetchData();
  };

  const handleToggleAnnouncement = async (a: Announcement) => {
    await supabase.from('announcements').update({ is_active: !a.is_active }).eq('id', a.id);
    await fetchData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    await fetchData();
  };

  const deposits = allRequests.filter((r) => r.type === 'deposit');
  const withdrawals = allRequests.filter((r) => r.type === 'withdraw');
  const pendingDeposits = deposits.filter((d) => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const filteredUsers = profiles.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()) || (u.phone ?? '').includes(search));

  const tabs: { id: Tab; label: string; icon: typeof Gamepad2; badge?: number }[] = [
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'matches', label: 'Matches', icon: Gamepad2, badge: matches.length || undefined },
    { id: 'deposits', label: 'Deposits', icon: Wallet, badge: pendingDeposits.length || undefined },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine, badge: pendingWithdrawals.length || undefined },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan shadow-neon-pink">
          <Shield className="h-5 w-5 text-ink-900" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-xs text-gray-500">Manage games, matches, payments, users &amp; announcements</p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-5">
        <StatCard icon={<Gamepad2 className="h-4 w-4 text-neon-cyan" />} label="Games" value={String(games.length)} color="#22f0e6" />
        <StatCard icon={<Gamepad2 className="h-4 w-4 text-neon-pink" />} label="Matches" value={String(matches.length)} color="#ff3df0" />
        <StatCard icon={<Wallet className="h-4 w-4 text-neon-green" />} label="Deposits" value={String(pendingDeposits.length)} color="#39ff8a" />
        <StatCard icon={<ArrowUpFromLine className="h-4 w-4 text-neon-red" />} label="Withdrawals" value={String(pendingWithdrawals.length)} color="#ff4d5e" />
        <StatCard icon={<UsersIcon className="h-4 w-4 text-neon-yellow" />} label="Users" value={String(profiles.length)} color="#ffe94e" />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all sm:px-4 ${active ? 'bg-ink-700 text-white' : 'bg-ink-700/40 text-gray-400 hover:text-gray-200'}`}
              style={active ? { boxShadow: '0 0 12px #22f0e633', border: '1px solid #22f0e644' } : undefined}>
              <Icon className="h-4 w-4" />{t.label}
              {t.badge ? <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-neon-red px-1 text-[10px] font-bold text-white">{t.badge}</span> : null}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-gray-600" /></div>
      ) : (
        <>
          {/* Games tab */}
          {tab === 'games' && (
            <div>
              <button onClick={() => { setEditingGame(null); setShowGameEditor(true); }}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3 font-display text-sm font-bold text-ink-900 transition-all hover:scale-[1.02]"
                style={{ boxShadow: '0 0 14px #22f0e655' }}>
                <Plus className="h-4 w-4" />Add New Game
              </button>
              <div className="space-y-2.5">
                {games.map((g) => (
                  <div key={g.id} className="flex items-center gap-3 rounded-xl border border-ink-600/60 bg-ink-700/50 px-3 py-3 sm:px-4">
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg sm:h-14 sm:w-24">
                      <GameThumbnail title={g.title} accent={g.accent} isPremium={g.is_premium} theme={g.thumbnail_theme} className="absolute inset-0 h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{g.title}</p>
                      <p className="text-[11px] text-gray-500">{g.subtitle} · {g.modes.join(', ') || 'No modes'}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button onClick={() => { setEditingGame(g); setShowGameEditor(true); }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-neon-cyan/15 text-neon-cyan transition-colors hover:bg-neon-cyan/25" title="Edit">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleToggleGame(g)}
                        className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${g.is_active ? 'bg-neon-green/15 text-neon-green hover:bg-neon-green/25' : 'bg-ink-600 text-gray-500'}`}
                        title={g.is_active ? 'Disable' : 'Enable'}>
                        <Power className="h-3.5 w-3.5" />
                      </button>
                      {deleteConfirmId === g.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDeleteGame(g.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-neon-red text-white" title="Confirm delete">
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(null)} className="grid h-8 w-8 place-items-center rounded-lg bg-ink-600 text-gray-400" title="Cancel">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(g.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-neon-red/15 text-neon-red transition-colors hover:bg-neon-red/25" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {games.length === 0 && (
                  <div className="rounded-2xl border border-ink-600/60 bg-ink-700/40 p-10 text-center">
                    <Gamepad2 className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">No games yet. Add one to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Matches tab */}
          {tab === 'matches' && (
            <div>
              <button onClick={() => setShowCreateMatch(true)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3 font-display text-sm font-bold text-ink-900 transition-all hover:scale-[1.02]"
                style={{ boxShadow: '0 0 14px #22f0e655' }}>
                <Plus className="h-4 w-4" />Create New Match
              </button>
              <div className="space-y-2.5">
                {matches.length === 0 ? (
                  <div className="rounded-2xl border border-ink-600/60 bg-ink-700/40 p-10 text-center">
                    <Gamepad2 className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">No matches created yet.</p>
                  </div>
                ) : matches.map((m) => {
                  const g = gameMap[m.game_id];
                  return (
                    <div key={m.id} className="rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: g ? `${g.accent}1a` : '#22f0e61a' }}>
                          <Gamepad2 className="h-4.5 w-4.5" style={{ color: g?.accent ?? '#22f0e6' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{g?.title ?? 'Unknown'} <span style={{ color: g?.accent }}>· {m.mode}</span></p>
                          <p className="text-[11px] text-gray-500">Entry ৳{m.entry_fee} · 1st ৳{m.first_prize} · 2nd ৳{m.second_prize} · {m.slots_filled}/{m.slots_total} slots</p>
                        </div>
                        <span className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: m.status === 'full' ? '#ff4d5e22' : '#39ff8a22', color: m.status === 'full' ? '#ff4d5e' : '#39ff8a' }}>
                          {m.status}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-2 border-t border-ink-600/50 pt-2">
                        <button onClick={() => setEditingMatch(m)} className="flex items-center gap-1 rounded-lg bg-neon-cyan/15 px-3 py-1.5 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/25">
                          <Pencil className="h-3 w-3" />Edit
                        </button>
                        {deleteMatchId === m.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDeleteMatch(m.id)} className="flex items-center gap-1 rounded-lg bg-neon-red px-3 py-1.5 text-xs font-bold text-white">
                              <Check className="h-3 w-3" />Confirm
                            </button>
                            <button onClick={() => setDeleteMatchId(null)} className="rounded-lg bg-ink-600 px-3 py-1.5 text-xs font-bold text-gray-400">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteMatchId(m.id)} className="flex items-center gap-1 rounded-lg bg-neon-red/15 px-3 py-1.5 text-xs font-bold text-neon-red hover:bg-neon-red/25">
                            <Trash2 className="h-3 w-3" />Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Inline match editor */}
              {editingMatch && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/80 backdrop-blur-md sm:items-center sm:px-4" onClick={() => setEditingMatch(null)}>
                  <div className="w-full max-w-md rounded-t-3xl border-t border-ink-600/60 bg-ink-800 p-5 sm:rounded-2xl sm:border" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-white">Edit Match</h3>
                      <button onClick={() => setEditingMatch(null)} className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-ink-700 hover:text-white">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <MatchEditor match={editingMatch} onSave={handleSaveMatch} onCancel={() => setEditingMatch(null)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deposits tab */}
          {tab === 'deposits' && (
            <div className="space-y-2.5">
              {deposits.length === 0 ? (
                <div className="rounded-2xl border border-ink-600/60 bg-ink-700/40 p-10 text-center">
                  <ArrowDownToLine className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                  <p className="text-sm text-gray-500">No deposit requests yet.</p>
                </div>
              ) : deposits.map((d) => (
                <RequestCard key={d.id} req={d} username={profileMap[d.user_id]?.username ?? 'Unknown'} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </div>
          )}

          {/* Withdrawals tab */}
          {tab === 'withdrawals' && (
            <div className="space-y-2.5">
              {withdrawals.length === 0 ? (
                <div className="rounded-2xl border border-ink-600/60 bg-ink-700/40 p-10 text-center">
                  <ArrowUpFromLine className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                  <p className="text-sm text-gray-500">No withdrawal requests yet.</p>
                </div>
              ) : withdrawals.map((w) => (
                <RequestCard key={w.id} req={w} username={profileMap[w.user_id]?.username ?? 'Unknown'} onApprove={handleApprove} onReject={handleReject} />
              ))}
            </div>
          )}

          {/* Users tab */}
          {tab === 'users' && (
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..."
                  className="w-full rounded-xl border border-ink-600/60 bg-ink-700/60 py-3 pl-11 pr-4 text-sm font-medium text-white outline-none transition-colors placeholder:text-gray-600 focus:border-neon-cyan/50" />
              </div>
              <div className="space-y-2.5">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink-600 to-ink-700">
                      <span className="font-display text-sm font-bold text-gray-300">{u.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{u.username}</p>
                      <p className="text-[11px] text-gray-500">{u.email ?? 'No email'} · {u.phone || 'No phone'}</p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-xs font-semibold text-gray-300">{u.matches_won}/{u.matches_played} won</p>
                      <p className="font-display text-sm font-bold text-neon-green">৳ {u.balance}</p>
                    </div>
                    <button onClick={() => handleBanUser(u.id, u.status)}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${u.status === 'banned' ? 'bg-neon-green/15 text-neon-green hover:bg-neon-green/25' : 'bg-neon-red/15 text-neon-red hover:bg-neon-red/25'}`}
                      title={u.status === 'banned' ? 'Unban user' : 'Ban user'}>
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                    <span className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: u.status === 'active' ? '#39ff8a22' : '#ff4d5e22', color: u.status === 'active' ? '#39ff8a' : '#ff4d5e' }}>
                      {u.status}
                    </span>
                  </div>
                ))}
                {filteredUsers.length === 0 && <p className="text-sm text-gray-500 text-center py-10">No users found.</p>}
              </div>
            </div>
          )}

          {/* Announcements tab */}
          {tab === 'announcements' && (
            <div>
              <button onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan py-3 font-display text-sm font-bold text-ink-900 transition-all hover:scale-[1.02]"
                style={{ boxShadow: '0 0 14px #22f0e655' }}>
                <Plus className="h-4 w-4" />{showAnnouncementForm ? 'Cancel' : 'Add Announcement'}
              </button>
              {showAnnouncementForm && (
                <div className="mb-4 space-y-3 rounded-xl border border-ink-600/60 bg-ink-700/50 p-4">
                  <input value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Announcement title"
                    className="w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-2.5 text-sm font-medium text-white outline-none focus:border-neon-cyan/50" />
                  <textarea value={annBody} onChange={(e) => setAnnBody(e.target.value)} placeholder="Announcement body" rows={3}
                    className="w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-2.5 text-sm font-medium text-white outline-none focus:border-neon-cyan/50" />
                  <button onClick={handleCreateAnnouncement} disabled={!annTitle.trim() || !annBody.trim()}
                    className="w-full rounded-xl bg-neon-green py-3 font-display text-sm font-bold text-ink-900 disabled:opacity-50">
                    Publish Announcement
                  </button>
                </div>
              )}
              <div className="space-y-2.5">
                {announcements.length === 0 ? (
                  <div className="rounded-2xl border border-ink-600/60 bg-ink-700/40 p-10 text-center">
                    <Megaphone className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">No announcements yet.</p>
                  </div>
                ) : announcements.map((a) => (
                  <div key={a.id} className="rounded-xl border border-ink-600/60 bg-ink-700/50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">{a.title}</p>
                        <p className="mt-1 text-xs text-gray-400">{a.body}</p>
                        <p className="mt-1 text-[10px] text-gray-600">{new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button onClick={() => handleToggleAnnouncement(a)}
                          className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${a.is_active ? 'bg-neon-green/15 text-neon-green hover:bg-neon-green/25' : 'bg-ink-600 text-gray-500'}`}
                          title={a.is_active ? 'Hide' : 'Show'}>
                          <Power className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDeleteAnnouncement(a.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-neon-red/15 text-neon-red transition-colors hover:bg-neon-red/25" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showCreateMatch && <CreateMatchModal onClose={() => setShowCreateMatch(false)} onCreate={handleCreateMatch} />}
      {showGameEditor && <GameEditorModal onClose={() => setShowGameEditor(false)} onSave={handleSaveGame} game={editingGame} />}
    </div>
  );
}

function MatchEditor({ match, onSave, onCancel }: { match: MatchRow; onSave: (m: MatchRow) => void; onCancel: () => void }) {
  const [entryFee, setEntryFee] = useState(String(match.entry_fee));
  const [firstPrize, setFirstPrize] = useState(String(match.first_prize));
  const [secondPrize, setSecondPrize] = useState(String(match.second_prize));
  const [slotsTotal, setSlotsTotal] = useState(String(match.slots_total));
  const [mode, setMode] = useState(match.mode);
  const [label, setLabel] = useState(match.label);
  const inputClass = 'w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-2.5 text-sm font-medium text-white outline-none focus:border-neon-cyan/50';

  return (
    <div className="space-y-3">
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Match label" className={inputClass} />
      <input value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Mode" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <input type="number" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} placeholder="Entry fee" className={inputClass} />
        <input type="number" value={slotsTotal} onChange={(e) => setSlotsTotal(e.target.value)} placeholder="Total slots" className={inputClass} />
        <input type="number" value={firstPrize} onChange={(e) => setFirstPrize(e.target.value)} placeholder="1st prize" className={inputClass} />
        <input type="number" value={secondPrize} onChange={(e) => setSecondPrize(e.target.value)} placeholder="2nd prize" className={inputClass} />
      </div>
      <button onClick={() => onSave({ ...match, entry_fee: Number(entryFee), first_prize: Number(firstPrize), second_prize: Number(secondPrize), slots_total: Number(slotsTotal), mode, label })}
        className="w-full rounded-xl bg-neon-cyan py-3 font-display text-sm font-bold text-ink-900 hover:scale-[1.02]">
        Save Changes
      </button>
      <button onClick={onCancel} className="w-full rounded-xl border border-ink-600 py-3 font-display text-sm font-bold text-gray-400">
        Cancel
      </button>
    </div>
  );
}

export default AdminScreen;
