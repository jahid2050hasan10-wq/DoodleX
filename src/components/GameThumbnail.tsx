type ThumbnailProps = {
  title: string;
  accent: string;
  isPremium?: boolean;
  theme?: string | null;
  className?: string;
};

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

const autoThemes = ['military', 'ludo', 'carrom', 'guti', 'free', 'arena'];

function detectTheme(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('militia') || t.includes('soldier') || t.includes('war') || t.includes('shoot')) return 'military';
  if (t.includes('ludo')) return 'ludo';
  if (t.includes('carrom')) return 'carrom';
  if (t.includes('guti') || t.includes('16')) return 'guti';
  if (t.includes('premium') || t.includes('vip')) return 'premium';
  if (t.includes('free') || t.includes('bonus') || t.includes('daily')) return 'free';
  return autoThemes[hashStr(title) % autoThemes.length];
}

function MilitaryTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `mil-${hashStr(title)}`;
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a2e30" />
          <stop offset="50%" stopColor="#0d4a4d" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <radialGradient id={`${uid}-exp`} cx="30%" cy="60%" r="30%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-exp2`} cx="80%" cy="45%" r="25%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="225" fill={`url(#${uid}-exp)`} />
      <rect width="400" height="225" fill={`url(#${uid}-exp2)`} />
      {/* Battlefield horizon */}
      <path d="M 0 175 L 60 160 L 120 168 L 200 152 L 280 162 L 340 155 L 400 165 L 400 225 L 0 225 Z" fill="#07070d" fillOpacity="0.7" />
      {/* Silhouette soldiers */}
      <g fill="#07070d" fillOpacity="0.85">
        <ellipse cx="120" cy="172" rx="5" ry="6" /><rect x="116" y="176" width="8" height="14" rx="2" />
        <ellipse cx="180" cy="168" rx="5" ry="6" /><rect x="176" y="172" width="8" height="14" rx="2" />
        <ellipse cx="260" cy="170" rx="5" ry="6" /><rect x="256" y="174" width="8" height="14" rx="2" />
      </g>
      {/* Crosshair */}
      <g transform="translate(280, 90)" stroke={accent} strokeWidth="1.5" fill="none" strokeOpacity="0.6">
        <circle r="22" /><line x1="-30" y1="0" x2="-10" y2="0" /><line x1="10" y1="0" x2="30" y2="0" /><line x1="0" y1="-30" x2="0" y2="-10" /><line x1="0" y1="10" x2="0" y2="30" />
        <circle r="1.5" fill={accent} />
      </g>
      {/* Muzzle flash */}
      <g transform="translate(60, 140)">
        <path d="M 0 0 L -14 -3 L -10 0 L -14 3 Z" fill={accent} opacity="0.7" />
        <circle cx="-18" cy="0" r="5" fill="#ffd700" opacity="0.4" />
      </g>
      {/* Bullet trails */}
      <g stroke={accent} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 4">
        <line x1="50" y1="130" x2="150" y2="100" />
        <line x1="70" y1="145" x2="180" y2="120" />
      </g>
    </>
  );
}

function LudoTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `ludo-${hashStr(title)}`;
  const tokenColors = ['#ff4d5e', '#39ff8a', '#22f0e6', '#ffe94e'];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a2e1a" />
          <stop offset="50%" stopColor="#0d4a28" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      {/* Ludo board — top-down view */}
      <g transform="translate(200, 110)">
        {/* Board outline */}
        <rect x="-80" y="-80" width="160" height="160" rx="8" fill="#07070d" fillOpacity="0.6" stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Four quadrants */}
        {tokenColors.map((c, i) => {
          const x = (i % 2) * 80 - 80;
          const y = Math.floor(i / 2) * 80 - 80;
          return <rect key={i} x={x} y={y} width="80" height="80" rx="4" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1" strokeOpacity="0.4" />;
        })}
        {/* Center star */}
        <g transform="scale(0.5)">
          <path d="M 0 -30 L 8 -10 L 30 -10 L 12 4 L 20 26 L 0 12 L -20 26 L -12 4 L -30 -10 L -8 -10 Z" fill={accent} fillOpacity="0.5" />
        </g>
        {/* Cross paths */}
        <rect x="-10" y="-80" width="20" height="80" fill="#1a1a2e" fillOpacity="0.6" />
        <rect x="-80" y="-10" width="80" height="20" fill="#1a1a2e" fillOpacity="0.6" />
        <rect x="10" y="0" width="20" height="80" fill="#1a1a2e" fillOpacity="0.6" />
        <rect x="0" y="-10" width="80" height="20" fill="#1a1a2e" fillOpacity="0.6" />
        {/* Tokens in each corner */}
        {tokenColors.map((c, i) => {
          const x = (i % 2) * 60 - 70 + 20;
          const y = Math.floor(i / 2) * 60 - 70 + 20;
          return <circle key={`t${i}`} cx={x} cy={y} r="6" fill={c} stroke="#07070d" strokeWidth="1.5" />;
        })}
      </g>
      {/* Dice */}
      <g transform="translate(320, 80)">
        <rect x="-16" y="-16" width="32" height="32" rx="6" fill="#1a1a2e" stroke={accent} strokeWidth="1.5" />
        <circle cx="-7" cy="-7" r="2.5" fill="#ffe94e" />
        <circle cx="7" cy="7" r="2.5" fill="#ffe94e" />
        <circle cx="7" cy="-7" r="2.5" fill="#ffe94e" />
        <circle cx="-7" cy="7" r="2.5" fill="#ffe94e" />
        <circle cx="0" cy="0" r="2.5" fill="#ffe94e" />
      </g>
    </>
  );
}

function CarromTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `carrom-${hashStr(title)}`;
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e1a0a" />
          <stop offset="50%" stopColor="#4a2e0d" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d03f" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      {/* Carrom board — top-down */}
      <g transform="translate(200, 112)">
        <rect x="-90" y="-90" width="180" height="180" rx="6" fill="#3d2817" fillOpacity="0.7" stroke={`url(#${uid}-gold)`} strokeWidth="2" />
        <rect x="-78" y="-78" width="156" height="156" rx="3" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="1" strokeOpacity="0.4" />
        {/* Corner pockets */}
        {[[-85, -85], [85, -85], [-85, 85], [85, 85]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="8" fill="#07070d" stroke={`url(#${uid}-gold)`} strokeWidth="1.5" />
        ))}
        {/* Center circle */}
        <circle r="14" fill="#1a1a2e" fillOpacity="0.5" stroke={`url(#${uid}-gold)`} strokeWidth="1" />
        {/* Coins */}
        <circle cx="-25" cy="-10" r="7" fill="#d4af37" stroke="#07070d" strokeWidth="1" />
        <circle cx="20" cy="-20" r="7" fill="#d4af37" stroke="#07070d" strokeWidth="1" />
        <circle cx="15" cy="25" r="7" fill="#ff4d5e" stroke="#07070d" strokeWidth="1" />
        <circle cx="-15" cy="20" r="7" fill="#ff4d5e" stroke="#07070d" strokeWidth="1" />
        <circle cx="0" cy="0" r="5" fill="#39ff8a" stroke="#07070d" strokeWidth="1" />
        {/* Striker */}
        <circle cx="-50" cy="40" r="9" fill="#22f0e6" stroke="#07070d" strokeWidth="2" />
        {/* Arrow lines */}
        <g stroke={`url(#${uid}-gold)`} strokeWidth="0.8" strokeOpacity="0.2">
          <line x1="-78" y1="0" x2="78" y2="0" />
          <line x1="0" y1="-78" x2="0" y2="78" />
        </g>
      </g>
    </>
  );
}

function GutiTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `guti-${hashStr(title)}`;
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e0a1a" />
          <stop offset="50%" stopColor="#4a0d2e" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      {/* 16 Guti board — grid 4x4 */}
      <g transform="translate(200, 112)">
        <rect x="-70" y="-70" width="140" height="140" rx="4" fill="#1a0a14" fillOpacity="0.6" stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Grid lines */}
        <g stroke={accent} strokeWidth="1" strokeOpacity="0.3">
          {[-52, -35, -17, 0, 17, 35, 52].map((p) => (
            <g key={p}>
              <line x1={p} y1="-70" x2={p} y2="70" />
              <line x1="-70" y1={p} x2="70" y2={p} />
            </g>
          ))}
        </g>
        {/* Guti pieces — alternating red and yellow */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => {
            const x = (col - 1.5) * 35;
            const y = (row - 1.5) * 35;
            const isRed = (row + col) % 2 === 0;
            const isTop = row < 2;
            return (
              <g key={`${row}-${col}`}>
                {isTop ? (
                  <circle cx={x} cy={y} r="8" fill={isRed ? '#ff4d5e' : '#ffe94e'} stroke="#07070d" strokeWidth="1" fillOpacity="0.85" />
                ) : (
                  <rect x={x - 7} y={y - 7} width="14" height="14" rx="2" fill={isRed ? '#ff4d5e' : '#ffe94e'} stroke="#07070d" strokeWidth="1" fillOpacity="0.85" />
                )}
              </g>
            );
          })
        )}
      </g>
    </>
  );
}

function FreeTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `free-${hashStr(title)}`;
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1a2e" />
          <stop offset="50%" stopColor="#0d2a4a" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="225" fill={`url(#${uid}-glow)`} />
      {/* Neon arena grid floor */}
      <g stroke={accent} strokeWidth="0.5" strokeOpacity="0.15">
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 120 + i * 12;
          const w = i * 30;
          return <line key={i} x1={200 - w} y1={y} x2={200 + w} y2={y} />;
        })}
      </g>
      {/* Trophy */}
      <g transform="translate(200, 95)">
        <path d="M -20 -25 L 20 -25 L 20 -10 Q 20 12 0 12 Q -20 12 -20 -10 Z" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="2" />
        <path d="M -15 -25 Q -20 -20 -20 -12" fill="none" stroke={accent} strokeWidth="1.5" />
        <path d="M 15 -25 Q 20 -20 20 -12" fill="none" stroke={accent} strokeWidth="1.5" />
        <line x1="0" y1="12" x2="0" y2="22" stroke={accent} strokeWidth="2" />
        <rect x="-10" y="22" width="20" height="5" rx="1" fill={accent} fillOpacity="0.3" stroke={accent} strokeWidth="1" />
        {/* Star on trophy */}
        <path d="M 0 -15 L 2 -9 L 8 -9 L 3 -5 L 5 1 L 0 -3 L -5 1 L -3 -5 L -8 -9 L -2 -9 Z" fill={accent} fillOpacity="0.8" />
      </g>
      {/* VS letters */}
      <text x="70" y="160" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontSize="36" fontWeight="700" fill={accent} fillOpacity="0.3">VS</text>
      <text x="330" y="160" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontSize="36" fontWeight="700" fill={accent} fillOpacity="0.3">VS</text>
      {/* Neon sparkles */}
      <g fill={accent}>
        <circle cx="50" cy="50" r="2" opacity="0.5" />
        <circle cx="350" cy="40" r="2.5" opacity="0.4" />
        <circle cx="60" cy="180" r="2" opacity="0.3" />
        <circle cx="340" cy="190" r="2" opacity="0.3" />
      </g>
    </>
  );
}

function ArenaTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `arena-${hashStr(title)}`;
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="50%" stopColor="#2e0d4a" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="225" fill={`url(#${uid}-glow)`} />
      {/* Controller */}
      <g transform="translate(200, 100)">
        <path d="M -50 -15 Q -58 -15 -58 -5 Q -62 10 -50 18 Q -35 25 0 22 Q 35 25 50 18 Q 62 10 58 -5 Q 58 -15 50 -15 L 25 -15 L -25 -15 Z"
          fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="2" />
        <circle cx="-28" cy="2" r="3" fill={accent} fillOpacity="0.7" />
        <circle cx="28" cy="2" r="3" fill={accent} fillOpacity="0.7" />
        <rect x="-6" y="-6" width="12" height="8" rx="2" fill="#07070d" stroke={accent} strokeWidth="1" />
      </g>
      {/* Sparkles */}
      <g fill={accent}>
        <circle cx="40" cy="40" r="2" opacity="0.4" />
        <circle cx="360" cy="50" r="2.5" opacity="0.3" />
        <circle cx="50" cy="180" r="2" opacity="0.3" />
      </g>
    </>
  );
}

function PremiumTheme({ accent, title }: { accent: string; title: string }) {
  const uid = `prem-${hashStr(title)}`;
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1500" />
          <stop offset="50%" stopColor="#0c0a00" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d03f" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="225" fill={`url(#${uid}-glow)`} />
      {/* Gold ornamental grid */}
      <g stroke="#d4af37" strokeOpacity="0.05" strokeWidth="1">
        {Array.from({ length: 5 }).map((_, i) => <line key={i} x1="0" y1={i * 56} x2="400" y2={i * 56} />)}
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={i * 56} y1="0" x2={i * 56} y2="225" />)}
      </g>
      {/* Crown */}
      <g transform="translate(200, 80)">
        <path d="M -30 10 L -20 -15 L -10 0 L 0 -20 L 10 0 L 20 -15 L 30 10 L 28 18 L -28 18 Z"
          fill={`url(#${uid}-gold)`} stroke="#f4d03f" strokeWidth="1" />
        <rect x="-28" y="18" width="56" height="5" rx="1" fill={`url(#${uid}-gold)`} />
        <circle cx="0" cy="-15" r="3" fill="#ff3df0" />
        <circle cx="-20" cy="-10" r="2.5" fill="#22f0e6" />
        <circle cx="20" cy="-10" r="2.5" fill="#22f0e6" />
      </g>
      {/* Gold sparkles */}
      <g fill="#d4af37">
        <path d="M 50 60 l 3 -6 l 3 6 l 6 3 l -6 3 l -3 6 l -3 -6 l -6 -3 z" opacity="0.3" />
        <path d="M 350 70 l 2 -4 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 z" opacity="0.25" />
      </g>
    </>
  );
}

const themeRenderers: Record<string, (p: { accent: string; title: string }) => React.ReactNode> = {
  military: MilitaryTheme,
  ludo: LudoTheme,
  carrom: CarromTheme,
  guti: GutiTheme,
  free: FreeTheme,
  arena: ArenaTheme,
  premium: PremiumTheme,
};

export const thumbnailThemes = [
  { id: 'auto', label: 'Auto-detect' },
  { id: 'military', label: 'Military Battlefield' },
  { id: 'ludo', label: 'Ludo Board' },
  { id: 'carrom', label: 'Carrom Board' },
  { id: 'guti', label: '16-Guti Board' },
  { id: 'free', label: 'Neon Arena' },
  { id: 'arena', label: 'Gaming Controller' },
  { id: 'premium', label: 'Premium Gold' },
];

export default function GameThumbnail({ title, accent, isPremium, theme, className }: ThumbnailProps) {
  const effectiveTheme = theme || (isPremium ? 'premium' : detectTheme(title));
  const renderer = themeRenderers[effectiveTheme] ?? ArenaTheme;
  const initials = title.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const uid = `thumb-${hashStr(title)}`;

  return (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice">
      {renderer({ accent, title })}
      {/* Title overlay */}
      <rect x="0" y="185" width="400" height="40" fill="#07070d" fillOpacity="0.75" />
      <text x="20" y="212" fontFamily="'Space Grotesk', sans-serif" fontSize="18" fontWeight="700" fill="#ffffff">
        {title.length > 20 ? title.slice(0, 18) + '…' : title}
      </text>
      {/* Initials badge */}
      <g transform="translate(370, 25)">
        <rect x="-22" y="-14" width="44" height="28" rx="5" fill="#07070d" fillOpacity="0.8" stroke={accent} strokeWidth="1" />
        <text x="0" y="5" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontSize="13" fontWeight="700" fill={accent}>{initials}</text>
      </g>
    </svg>
  );
}
