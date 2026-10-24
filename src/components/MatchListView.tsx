import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ArrowLeft,
  Upload,
  Trophy,
  Crown,
  Medal,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { GameId } from '@/data/games';
import { supabase, type Match as DBMatch } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

type MatchListViewProps = {
  gameId: GameId;
  gameTitle: string;
  gameImage: string;
  gameAccent: string;
  onBack: () => void;
};

const screenshotGames: GameId[] = ['mini-militia'];

type LocalMatch = {
  id: string;
  game_id: string;
  label: string;
  mode: string;
  entry_fee: number;
  first_prize: number;
  second_prize: number;
  slots_filled: number;
  slots_total: number;
  status: string;
};

const seedMatches: LocalMatch[] = [
  { id: 'mm-3v3-001', game_id: 'mini-militia', label: 'Match #001', mode: '3v3', entry_fee: 30, first_prize: 150, second_prize: 60, slots_filled: 4, slots_total: 6, status: 'open' },
  { id: 'mm-ffa-002', game_id: 'mini-militia', label: 'Match #002', mode: '6-FFA', entry_fee: 50, first_prize: 250, second_prize: 100, slots_filled: 3, slots_total: 6, status: 'open' },
  { id: 'mm-3v3-003', game_id: 'mini-militia', label: 'Match #003', mode: '3v3', entry_fee: 100, first_prize: 500, second_prize: 200, slots_filled: 2, slots_total: 6, status: 'open' },
  { id: 'ludo-1v1-001', game_id: 'ludo-3d', label: 'Match #001', mode: '1v1', entry_fee: 20, first_prize: 35, second_prize: 0, slots_filled: 1, slots_total: 2, status: 'open' },
  { id: 'ludo-2v2-002', game_id: 'ludo-3d', label: 'Match #002', mode: '2v2', entry_fee: 40, first_prize: 70, second_prize: 0, slots_filled: 2, slots_total: 4, status: 'open' },
  { id: 'carrom-1v1-001', game_id: 'carrom-pool', label: 'Match #001', mode: '1v1', entry_fee: 20, first_prize: 35, second_prize: 0, slots_filled: 1, slots_total: 2, status: 'open' },
  { id: 'carrom-2v2-002', game_id: 'carrom-pool', label: 'Match #002', mode: '2v2', entry_fee: 40, first_prize: 70, second_prize: 0, slots_filled: 0, slots_total: 4, status: 'open' },
  { id: 'guti-1v1-001', game_id: '16-guti', label: 'Match #001', mode: '1v1', entry_fee: 25, first_prize: 45, second_prize: 0, slots_filled: 1, slots_total: 2, status: 'open' },
  { id: 'guti-1v1-002', game_id: '16-guti', label: 'Match #002', mode: '1v1', entry_fee: 60, first_prize: 100, second_prize: 0, slots_filled: 0, slots_total: 2, status: 'open' },
  { id: 'free-001', game_id: 'free-match', label: 'Casual #001', mode: 'Any', entry_fee: 0, first_prize: 0, second_prize: 0, slots_filled: 5, slots_total: 8, status: 'open' },
  { id: 'free-20-001', game_id: 'free-20', label: 'Daily Bonus', mode: '1v1', entry_fee: 0, first_prize: 20, second_prize: 0, slots_filled: 1, slots_total: 2, status: 'open' },
];

function PrizeRow({ icon, label, amount, color }: { icon: React.ReactNode; label: string; amount: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${color}1a` }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{label}</p>
        <p className="font-display text-sm font-bold leading-tight" style={{ color }}>
          {amount > 0 ? `৳ ${amount}` : '—'}
        </p>
      </div>
    </div>
  );
}

function MatchCard({
  match,
  accent,
  canScreenshot,
  onJoin,
  joining,
  joinError,
  joined,
}: {
  match: LocalMatch;
  accent: string;
  canScreenshot: boolean;
  onJoin: (id: string) => void;
  joining: boolean;
  joinError: string;
  joined: boolean;
}) {
  const slotsPct = Math.round((match.slots_filled / match.slots_total) * 100);
  const isFull = match.slots_filled >= match.slots_total;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-600/60 bg-ink-700/70 transition-colors hover:border-ink-500">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${accent}22` }}>
        <div className="flex items-center gap-2">
          <span className="rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${accent}1a`, color: accent }}>
            {match.mode}
          </span>
          <span className="text-sm font-semibold text-gray-300">{match.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Users className="h-3.5 w-3.5" />
          <span>{match.slots_filled}/{match.slots_total}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-500">Entry Fee</p>
          <p className="font-display text-base font-bold text-white">{match.entry_fee > 0 ? `৳ ${match.entry_fee}` : 'FREE'}</p>
        </div>
        <PrizeRow icon={<Crown className="h-3.5 w-3.5 text-neon-yellow" />} label="1st Prize" amount={match.first_prize} color="#ffe94e" />
        <PrizeRow icon={<Medal className="h-3.5 w-3.5 text-neon-cyan" />} label="2nd Prize" amount={match.second_prize} color="#22f0e6" />
      </div>

      <div className="px-4 pb-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-600">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${slotsPct}%`, backgroundColor: isFull ? '#ff4d5e' : accent, boxShadow: `0 0 6px ${isFull ? '#ff4d5e' : accent}` }}
          />
        </div>
      </div>

      {joinError && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-neon-red/30 bg-red-950/30 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-red" />
          <p className="text-xs font-medium text-neon-red">{joinError}</p>
        </div>
      )}

      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={() => onJoin(match.id)}
          disabled={isFull || joined || joining}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-display text-sm font-bold transition-all ${
            isFull || (joined && !joining)
              ? 'cursor-not-allowed bg-ink-600 text-gray-500'
              : 'text-ink-900 hover:scale-[1.02]'
          }`}
          style={isFull || joined ? undefined : { backgroundColor: accent, boxShadow: `0 0 14px ${accent}55` }}
        >
          {joining && <Loader2 className="h-4 w-4 animate-spin" />}
          {joined ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Joined
            </>
          ) : isFull ? (
            'Match Full'
          ) : (
            'Join Match'
          )}
        </button>
        {canScreenshot && (
          <button className="flex items-center gap-1.5 rounded-xl border border-neon-pink/40 bg-neon-pink/10 px-4 py-2.5 font-display text-sm font-bold text-neon-pink transition-all hover:bg-neon-pink/20">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Screenshot</span>
            <span className="sm:hidden">Upload</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function MatchListView({ gameId, gameTitle, gameImage, gameAccent, onBack }: MatchListViewProps) {
  const { profile, refreshProfile } = useAuth();
  const [matchList, setMatchList] = useState<LocalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState('');
  const [joinedId, setJoinedId] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setMatchList(data as LocalMatch[]);
    } else {
      setMatchList(seedMatches.filter((m) => m.game_id === gameId));
    }
    setLoading(false);
  }, [gameId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Real-time subscription for match updates
  useEffect(() => {
    const channel = supabase
      .channel(`matches-${gameId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `game_id=eq.${gameId}` },
        () => fetchMatches()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, fetchMatches]);

  const handleJoin = async (matchId: string) => {
    if (!profile) return;
    setJoiningId(matchId);
    setJoinError('');

    const { data, error } = await supabase.rpc('join_match', { p_match_id: matchId });

    if (error) {
      setJoinError(error.message);
      setJoiningId(null);
      return;
    }

    if (data && data.error) {
      setJoinError(data.error);
      setJoiningId(null);
      return;
    }

    setJoinedId(matchId);
    setJoiningId(null);
    await fetchMatches();
    await refreshProfile();
    setTimeout(() => setJoinedId(null), 2000);
  };

  const canScreenshot = screenshotGames.includes(gameId);
  const gameMatches = matchList.filter((m) => m.game_id === gameId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Games
      </button>

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-ink-600/60">
        <img src={gameImage} alt={gameTitle} className="h-32 w-full object-cover sm:h-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/20" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" style={{ color: gameAccent }} />
              <h2 className="font-display text-2xl font-bold text-white">{gameTitle}</h2>
            </div>
            <p className="mt-1 text-sm text-gray-400">{gameMatches.length} matches available</p>
          </div>
        </div>
      </div>

      {canScreenshot && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-neon-red/25 bg-red-950/20 p-3.5">
          <Upload className="mt-0.5 h-4 w-4 shrink-0 text-neon-red" />
          <p className="text-xs leading-relaxed text-red-300/90">
            শুধু প্রথম ও দ্বিতীয় হওয়া প্লেয়ার স্ক্রিনশট দিবে — Only the 1st and 2nd place players need to upload a screenshot.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        </div>
      ) : gameMatches.length === 0 ? (
        <div className="rounded-2xl border border-ink-600/60 bg-ink-700/50 p-10 text-center">
          <p className="text-sm text-gray-400">No matches are open right now. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gameMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              accent={gameAccent}
              canScreenshot={canScreenshot}
              onJoin={handleJoin}
              joining={joiningId === match.id}
              joinError={joiningId === match.id ? joinError : ''}
              joined={joinedId === match.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
