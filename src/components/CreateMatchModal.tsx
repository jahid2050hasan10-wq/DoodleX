import { useState } from 'react';
import { X } from 'lucide-react';
import type { Game } from '@/lib/supabase';
import { useGames } from '@/lib/useGames';

type CreateMatchModalProps = {
  onClose: () => void;
  onCreate: (match: { gameId: string; label: string; mode: string; entryFee: number; firstPrize: number; secondPrize: number; slotsTotal: number }) => void;
};

export default function CreateMatchModal({ onClose, onCreate }: CreateMatchModalProps) {
  const { games } = useGames();
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [firstPrize, setFirstPrize] = useState('');
  const [secondPrize, setSecondPrize] = useState('');
  const [slotsTotal, setSlotsTotal] = useState('');

  const selectedGame = games.find((g) => g.id === gameId);
  const valid = gameId !== '' && mode !== '' && entryFee !== '' && firstPrize !== '' && slotsTotal !== '' && Number(slotsTotal) > 0;

  const handleSelectGame = (g: Game) => {
    setGameId(g.id);
    setMode(g.modes[0] ?? '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onCreate({
      gameId,
      label: `Match #${Date.now().toString().slice(-4)}`,
      mode,
      entryFee: Number(entryFee),
      firstPrize: Number(firstPrize),
      secondPrize: secondPrize ? Number(secondPrize) : 0,
      slotsTotal: Number(slotsTotal),
    });
    onClose();
  };

  const inputClass = 'w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-3 text-sm font-medium text-white outline-none transition-colors placeholder:text-gray-600 focus:border-neon-cyan/50';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/80 backdrop-blur-md sm:items-center sm:px-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto no-scrollbar rounded-t-3xl border-t border-ink-600/60 bg-ink-800 pb-8 sm:rounded-2xl sm:border" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-600/60 bg-ink-800/95 px-5 py-4 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold text-white">Create New Match</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-ink-700 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-ink-600 sm:hidden" />
        <form onSubmit={handleSubmit} className="px-5 pt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Game</label>
            {games.length === 0 ? (
              <p className="text-sm text-gray-500">No games available. Add games first from the Games tab.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {games.map((g) => (
                  <button key={g.id} type="button" onClick={() => handleSelectGame(g)}
                    className={`rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition-all ${gameId === g.id ? 'bg-ink-700 text-white' : 'border-ink-600/60 bg-ink-700/40 text-gray-400 hover:border-ink-500'}`}
                    style={gameId === g.id ? { borderColor: g.accent, boxShadow: `0 0 10px ${g.accent}44` } : undefined}>
                    {g.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedGame && selectedGame.modes.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Mode</label>
              <div className="flex gap-2">
                {selectedGame.modes.map((m) => (
                  <button key={m} type="button" onClick={() => setMode(m)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === m ? 'text-ink-900' : 'border border-ink-600/60 bg-ink-700/40 text-gray-400'}`}
                    style={mode === m ? { backgroundColor: selectedGame.accent } : undefined}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Entry Fee (৳)</label>
              <input type="number" inputMode="numeric" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} placeholder="50" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">Total Slots</label>
              <input type="number" inputMode="numeric" value={slotsTotal} onChange={(e) => setSlotsTotal(e.target.value)} placeholder="6" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">1st Prize (৳)</label>
              <input type="number" inputMode="numeric" value={firstPrize} onChange={(e) => setFirstPrize(e.target.value)} placeholder="250" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">2nd Prize (৳)</label>
              <input type="number" inputMode="numeric" value={secondPrize} onChange={(e) => setSecondPrize(e.target.value)} placeholder="100" className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={!valid}
            className={`mt-2 w-full rounded-xl py-3.5 font-display text-base font-bold transition-all ${valid ? 'text-ink-900 hover:scale-[1.02]' : 'cursor-not-allowed bg-ink-600 text-gray-500'}`}
            style={valid ? { backgroundColor: '#22f0e6', boxShadow: '0 0 16px #22f0e655' } : undefined}>
            Create Match
          </button>
        </form>
      </div>
    </div>
  );
}
