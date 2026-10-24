import { useState } from 'react';
import { X } from 'lucide-react';
import type { Game } from '@/lib/supabase';
import GameThumbnail, { thumbnailThemes } from '@/components/GameThumbnail';

type GameEditorModalProps = {
  onClose: () => void;
  onSave: (game: Partial<Game>) => Promise<void>;
  game?: Game | null;
};

const accentPresets = ['#22f0e6', '#39ff8a', '#ff3df0', '#ffe94e', '#ff4d5e', '#d4af37', '#a78bfa', '#f97316'];

export default function GameEditorModal({ onClose, onSave, game }: GameEditorModalProps) {
  const [title, setTitle] = useState(game?.title ?? '');
  const [subtitle, setSubtitle] = useState(game?.subtitle ?? '');
  const [accent, setAccent] = useState(game?.accent ?? '#22f0e6');
  const [badge, setBadge] = useState(game?.badge ?? '');
  const [isPremium, setIsPremium] = useState(game?.is_premium ?? false);
  const [isActive, setIsActive] = useState(game?.is_active ?? true);
  const [modes, setModes] = useState((game?.modes ?? []).join(', '));
  const [supportsScreenshot, setSupportsScreenshot] = useState(game?.supports_screenshot ?? false);
  const [thumbnailTheme, setThumbnailTheme] = useState(game?.thumbnail_theme ?? 'auto');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'w-full rounded-xl border border-ink-600/60 bg-ink-700/60 px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors placeholder:text-gray-600 focus:border-neon-cyan/50';
  const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500';

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Game title is required.'); return; }
    setSaving(true);
    try {
      await onSave({
        ...(game?.id ? { id: game.id } : {}),
        title: title.trim(),
        subtitle: subtitle.trim(),
        accent,
        badge: badge.trim() || null,
        is_premium: isPremium,
        is_active: isActive,
        modes: modes.split(',').map((m) => m.trim()).filter(Boolean),
        supports_screenshot: supportsScreenshot,
        thumbnail_theme: thumbnailTheme === 'auto' ? null : thumbnailTheme,
        slug: slugify(title),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save game');
    }
    setSaving(false);
  };

  const resolvedTheme = thumbnailTheme === 'auto' ? null : thumbnailTheme;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/80 backdrop-blur-md sm:items-center sm:px-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto no-scrollbar rounded-t-3xl border-t border-ink-600/60 bg-ink-800 pb-8 sm:rounded-2xl sm:border" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-600/60 bg-ink-800/95 px-5 py-4 backdrop-blur-xl">
          <h3 className="font-display text-lg font-bold text-white">{game ? 'Edit Game' : 'Add New Game'}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-ink-700 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-ink-600 sm:hidden" />

        {/* Live thumbnail preview */}
        <div className="px-5 pt-4">
          <label className={labelClass}>Thumbnail Preview (auto-updates with name)</label>
          <div className="overflow-hidden rounded-xl border border-ink-600/60">
            <GameThumbnail title={title || 'Game Title'} accent={accent} isPremium={isPremium} theme={resolvedTheme} className="w-full" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 pt-4">
          <div>
            <label className={labelClass}>Game Name</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mini Militia" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. 3v3 · 6-FFA" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Thumbnail Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {thumbnailThemes.map((t) => (
                <button key={t.id} type="button" onClick={() => setThumbnailTheme(t.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${thumbnailTheme === t.id ? 'bg-ink-700 text-white border-neon-cyan/50' : 'border-ink-600/60 bg-ink-700/40 text-gray-400'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Match Modes (comma-separated)</label>
            <input value={modes} onChange={(e) => setModes(e.target.value)} placeholder="1v1, 2v2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Badge (optional)</label>
            <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="HOT, FREE, VIP" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {accentPresets.map((c) => (
                <button key={c} type="button" onClick={() => setAccent(c)}
                  className={`h-9 w-9 rounded-lg transition-all ${accent === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: c, boxShadow: accent === c ? `0 0 12px ${c}88` : undefined }} />
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="h-4 w-4 rounded accent-neon-cyan" />
              <span className="text-sm text-gray-300">Premium game</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded accent-neon-green" />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={supportsScreenshot} onChange={(e) => setSupportsScreenshot(e.target.checked)} className="h-4 w-4 rounded accent-neon-pink" />
            <span className="text-sm text-gray-300">Requires screenshot upload</span>
          </label>
          {error && <p className="text-xs font-medium text-neon-red">{error}</p>}
          <button type="submit" disabled={saving}
            className="w-full rounded-xl bg-neon-cyan py-3.5 font-display text-base font-bold text-ink-900 transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ boxShadow: '0 0 16px #22f0e655' }}>
            {saving ? 'Saving...' : game ? 'Save Changes' : 'Create Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
