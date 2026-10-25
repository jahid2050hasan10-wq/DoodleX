
import { useState, useEffect } from 'react';
import {
  Wallet,
  Home,
  Trophy,
  User,
  ChevronRight,
  Zap,
  Loader2,
} from 'lucide-react';
import type { Game } from '@/lib/supabase';
import MatchListView from '@/components/MatchListView';
import WalletScreen from '@/components/WalletScreen';
import ProfileScreen from '@/components/ProfileScreen';
import AuthScreen from '@/components/AuthScreen';
import GameThumbnail from '@/components/GameThumbnail';
import { DoodleXLogo } from '@/components/DoodleXLogo';
import { useAuth } from '@/lib/auth';
import { useGames } from '@/lib/useGames';

type NavId = 'home' | 'matches' | 'wallet' | 'profile';

const navItems: { id: NavId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'matches', label: 'My Matches', icon: Trophy },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
];

function GameCard({
  game,
  idx,
  onSelect,
}: {
  game: Game;
  idx: number;
  onSelect: (g: Game) => void;
}) {
  return (
    <button
      onClick={() => onSelect(game)}
      style={{ animationDelay: `${idx * 50}ms` }}
      className={`group relative aspect-[3/4] overflow-hidden rounded-xl border border-ink-600/60 bg-ink-700 text-left opacity-0 animate-float-in transition-all duration-300 hover:-translate-y-1 hover:border-transparent sm:rounded-2xl ${
        game.is_premium ? 'border-yellow-600/30' : ''
      }`}
    >
      <GameThumbnail
        title={game.title}
        accent={game.accent}
        isPremium={game.is_premium}
        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: `0 0 0 2px ${game.accent}, 0 0 24px ${game.accent}55`,
        }}
      />

      {game.badge && (
        <span
          className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:top-2.5 sm:right-2.5 sm:px-2.5 sm:py-1 sm:text-[10px]"
          style={{ backgroundColor: game.accent, color: '#07070d' }}
        >
          {game.badge}
        </span>
      )}

      {!game.is_active && (
        <span className="absolute top-2 left-2 rounded-full bg-neon-red/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          Disabled
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
        <p
          className="text-[9px] font-semibold uppercase tracking-wider sm:text-[11px]"
          style={{ color: game.accent }}
        >
          {game.subtitle}
        </p>

        <h4 className="mt-0.5 font-display text-sm font-bold leading-tight text-white sm:text-lg">
          {game.title}
        </h4>

        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:mt-2 sm:text-xs">
          <span>Play Now</span>
          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </div>
      </div>
    </button>
  );
}

function App() {
  const { session, profile, loading } = useAuth();
  const { games, loading: gamesLoading } = useGames();

  const [activeNav, setActiveNav] = useState<NavId>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    if (session) {
      setActiveNav('home');
      setSelectedGame(null);
    }
  }, [session]);

  const handleNavClick = (id: NavId) => {
    setActiveNav(id);
    setSelectedGame(null);
  };

  if (loading || (session && gamesLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const balance = profile?.balance ?? 0;
  const activeGames = games.filter((g) => g.is_active && !g.is_premium);
  const premiumGames = games.filter((g) => g.is_active && g.is_premium);

  return (
    <div className="min-h-screen bg-ink-900 font-body text-gray-100 pb-24">
      <header className="sticky top-0 z-40 border-b border-ink-600/60 bg-ink-900/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-ink-800 ring-1 ring-ink-600/60">
              <DoodleXLogo className="h-7 w-7" />
            </div>

            <div className="leading-none">
              <span className="font-display text-xl font-bold tracking-tight">
                Doodle<span className="text-neon-cyan">X</span>
              </span>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
                Play &amp; Win
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-neon-green/30 bg-ink-700/60 px-3 py-1.5 shadow-neon-green">
            <Wallet className="h-4 w-4 text-neon-green" />
            <span className="font-display text-sm font-semibold text-neon-green">
              ৳ {balance}
            </span>
          </div>
        </div>
      </header>

      <div className="overflow-hidden border-b border-red-500/20 bg-red-950/30 py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="px-4 text-xs font-semibold text-neon-red sm:text-sm">
            শুধু প্রথম ও দ্বিতীয় হওয়া প্লেয়ার স্ক্রিনশট দিবে
          </span>
          <span className="px-4 text-xs font-semibold text-neon-red sm:text-sm">
            শুধু প্রথম ও দ্বিতীয় হওয়া প্লেয়ার স্ক্রিনশট দিবে
          </span>
        </div>
      </div>

      {selectedGame ? (
        <MatchListView
          game={selectedGame}
          onBack={() => setSelectedGame(null)}
        />
      ) : activeNav === 'wallet' ? (
        <WalletScreen />
      ) : activeNav === 'profile' ? (
        <ProfileScreen />
      ) : activeNav === 'matches' ? (
        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-600/60 bg-ink-700/40 py-20 text-center">
            <Trophy className="mb-3 h-10 w-10 text-gray-600" />
            <p className="font-display text-lg font-bold text-gray-300">
              My Matches
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Your joined tournaments will appear here.
            </p>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-5xl px-4 py-5">
          <section className="mb-5 overflow-hidden rounded-2xl border border-ink-600/60 bg-gradient-to-r from-ink-700 via-ink-800 to-ink-700 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-neon-cyan/10">
                <Zap className="h-6 w-6 text-neon-cyan" />
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-base font-bold text-white sm:text-lg">
                  Welcome, {profile?.username ?? 'Player'}!
                </h2>
                <p className="truncate text-xs text-gray-400 sm:text-sm">
                  Pick a game, join a match, and start winning real cash.
                </p>
              </div>
            </div>
          </section>

          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gray-300">
              Games
            </h3>
            <span className="text-xs font-medium text-gray-500">
              {activeGames.length} available
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {activeGames.map((game, idx) => (
              <GameCard
                key={game.id}
                game={game}
                idx={idx}
                onSelect={setSelectedGame}
              />
            ))}
          </div>

          {premiumGames.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
                <h3
                  className="font-display text-sm font-bold uppercase tracking-wider"
                  style={{ color: '#d4af37' }}
                >
                  Premium
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {premiumGames.map((game, idx) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    idx={idx}
                    onSelect={setSelectedGame}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-600/60 bg-ink-800/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-stretch justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors"
              >
                {isActive && (
                  <span
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-neon-cyan"
                    style={{ boxShadow: '0 0 8px #22f0e6' }}
                  />
                )}

                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-neon-cyan' : 'text-gray-500'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-neon-cyan' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}

export default App;