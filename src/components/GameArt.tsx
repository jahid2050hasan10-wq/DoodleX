type ArtProps = {
  className?: string;
};

// Black-and-gold premium esports membership thumbnail
export function PremiumArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 400 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="pr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1500" />
          <stop offset="50%" stopColor="#0c0a00" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <radialGradient id="pr-glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pr-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d03f" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id="pr-gold-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <filter id="pr-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="480" fill="url(#pr-bg)" />
      <rect width="400" height="480" fill="url(#pr-glow)" />

      {/* Gold ornamental grid */}
      <g stroke="#d4af37" strokeOpacity="0.06" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`ph${i}`} x1="0" y1={i * 60} x2="400" y2={i * 60} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`pv${i}`} x1={i * 60} y1="0" x2={i * 60} y2="480" />
        ))}
      </g>

      {/* Gold sparkle diamonds */}
      <g fill="#d4af37">
        <path d="M 50 70 l 3 -6 l 3 6 l 6 3 l -6 3 l -3 6 l -3 -6 l -6 -3 z" opacity="0.3" />
        <path d="M 350 80 l 2.5 -5 l 2.5 5 l 5 2.5 l -5 2.5 l -2.5 5 l -2.5 -5 l -5 -2.5 z" opacity="0.2" />
        <path d="M 340 300 l 2 -4 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 z" opacity="0.15" />
        <path d="M 40 400 l 2 -4 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 z" opacity="0.2" />
      </g>

      {/* Crown */}
      <g filter="url(#pr-glow-filter)">
        <path
          d="M 120 120 L 145 80 L 170 110 L 200 60 L 230 110 L 255 80 L 280 120 L 275 165 L 125 165 Z"
          fill="url(#pr-gold)"
          stroke="#f4d03f"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Crown base bar */}
        <rect x="125" y="160" width="150" height="12" rx="2" fill="url(#pr-gold-dark)" stroke="#f4d03f" strokeWidth="1" />
        {/* Crown gems */}
        <circle cx="200" cy="70" r="5" fill="#ff3df0" stroke="#f4d03f" strokeWidth="1" opacity="0.9" />
        <circle cx="150" cy="100" r="3.5" fill="#22f0e6" stroke="#f4d03f" strokeWidth="1" opacity="0.8" />
        <circle cx="250" cy="100" r="3.5" fill="#22f0e6" stroke="#f4d03f" strokeWidth="1" opacity="0.8" />
        {/* Crown dots on base */}
        <circle cx="150" cy="166" r="2" fill="#07070d" opacity="0.5" />
        <circle cx="200" cy="166" r="2" fill="#07070d" opacity="0.5" />
        <circle cx="250" cy="166" r="2" fill="#07070d" opacity="0.5" />
      </g>

      {/* PREMIUM text */}
      <g filter="url(#pr-glow-filter)">
        <text
          x="200"
          y="230"
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="42"
          fontWeight="700"
          fill="url(#pr-gold)"
          stroke="#f4d03f"
          strokeWidth="0.5"
          letterSpacing="2"
        >
          PREMIUM
        </text>
        {/* Gold underline */}
        <path
          d="M 110 245 L 290 245"
          stroke="url(#pr-gold)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 110 245 L 160 245"
          stroke="#f4d03f"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 240 245 L 290 245"
          stroke="#f4d03f"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Luxury controller */}
      <g transform="translate(200, 340)" filter="url(#pr-glow-filter)">
        {/* Controller body */}
        <path
          d="M -85 -28 Q -95 -28 -95 -12 Q -100 14 -85 28 Q -65 44 -32 38 Q 0 34 32 38 Q 65 44 85 28 Q 100 14 95 -12 Q 95 -28 85 -28 L 42 -28 Q 21 -28 0 -28 L -42 -28 Z"
          fill="#1a1500"
          stroke="url(#pr-gold)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Gold trim accent */}
        <path
          d="M -85 -28 Q -95 -28 -95 -12 Q -100 14 -85 28 Q -65 44 -32 38 Q 0 34 32 38 Q 65 44 85 28 Q 100 14 95 -12 Q 95 -28 85 -28"
          fill="none"
          stroke="#f4d03f"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* D-pad (gold) */}
        <g stroke="url(#pr-gold)" strokeWidth="2" strokeLinecap="round" fill="none">
          <line x1="-55" y1="-8" x2="-55" y2="8" />
          <line x1="-63" y1="0" x2="-47" y2="0" />
        </g>
        {/* Action buttons (gold) */}
        <g>
          <circle cx="45" cy="-10" r="4" fill="url(#pr-gold)" opacity="0.9" />
          <circle cx="58" cy="-2" r="4" fill="#f4d03f" opacity="0.7" />
          <circle cx="45" cy="6" r="4" fill="url(#pr-gold-dark)" opacity="0.8" />
          <circle cx="32" cy="-2" r="4" fill="#d4af37" opacity="0.6" />
        </g>
        {/* Center emblem */}
        <rect x="-14" y="-14" width="28" height="18" rx="3" fill="#07070d" stroke="url(#pr-gold)" strokeWidth="1.5" />
        <path d="M -6 -5 L 0 -12 L 6 -5 L 4 3 L -4 3 Z" fill="url(#pr-gold)" opacity="0.8" />
        {/* Shoulder buttons */}
        <path d="M -62 -30 L -30 -30" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M 30 -30 L 62 -30" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Ornamental flourishes */}
      <g stroke="url(#pr-gold)" strokeWidth="1" strokeOpacity="0.15" fill="none">
        <path d="M 20 200 Q 50 200 60 220 Q 50 240 20 240" />
        <path d="M 380 200 Q 350 200 340 220 Q 350 240 380 240" />
      </g>
    </svg>
  );
}

// Doodle-style soldier with a gun on neon cyan background
export function MiniMilitiaArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 400 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="mm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a2e30" />
          <stop offset="40%" stopColor="#0d4a4d" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <radialGradient id="mm-glow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#22f0e6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22f0e6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mm-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a4a55" />
          <stop offset="50%" stopColor="#6b7d8a" />
          <stop offset="100%" stopColor="#2a3a45" />
        </linearGradient>
        <linearGradient id="mm-vest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3a3d" />
          <stop offset="100%" stopColor="#0d2830" />
        </linearGradient>
        <linearGradient id="mm-skin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a06a" />
          <stop offset="100%" stopColor="#b07f4e" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="480" fill="url(#mm-bg)" />
      <rect width="400" height="480" fill="url(#mm-glow)" />

      {/* Doodle grid lines */}
      <g stroke="#22f0e6" strokeOpacity="0.08" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="400" y2={i * 60} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="480" />
        ))}
      </g>

      {/* Doodle stars / sparks */}
      <g fill="#22f0e6">
        <circle cx="60" cy="80" r="2" opacity="0.5" />
        <circle cx="330" cy="60" r="3" opacity="0.4" />
        <circle cx="350" cy="200" r="2" opacity="0.3" />
        <circle cx="40" cy="300" r="2.5" opacity="0.4" />
        <circle cx="370" cy="380" r="2" opacity="0.3" />
        <path d="M 310 250 l 4 -8 l 4 8 l 8 4 l -8 4 l -4 8 l -4 -8 l -8 -4 z" opacity="0.25" />
        <path d="M 50 150 l 3 -6 l 3 6 l 6 3 l -6 3 l -3 6 l -3 -6 l -6 -3 z" opacity="0.2" />
      </g>

      {/* Soldier body — doodle style */}
      {/* Legs */}
      <g stroke="#22f0e6" strokeWidth="2.5" strokeLinecap="round" fill="none">
        {/* Left leg */}
        <path d="M 175 310 L 168 380 L 162 440" />
        {/* Right leg */}
        <path d="M 215 310 L 222 380 L 228 440" />
      </g>
      <g fill="#1a3a3d" stroke="#22f0e6" strokeWidth="2" strokeLinejoin="round">
        <ellipse cx="162" cy="442" rx="14" ry="8" />
        <ellipse cx="228" cy="442" rx="14" ry="8" />
      </g>

      {/* Torso / vest */}
      <g>
        <path
          d="M 155 210 Q 145 200 150 240 L 160 310 Q 160 320 195 320 L 205 320 Q 240 320 240 310 L 250 240 Q 255 200 245 210 Z"
          fill="url(#mm-vest)"
          stroke="#22f0e6"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Vest straps */}
        <path d="M 170 215 L 185 310" stroke="#22f0e6" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
        <path d="M 230 215 L 215 310" stroke="#22f0e6" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
        {/* Vest pockets */}
        <rect x="162" y="240" width="22" height="18" rx="3" fill="none" stroke="#22f0e6" strokeWidth="1.5" strokeOpacity="0.5" />
        <rect x="216" y="240" width="22" height="18" rx="3" fill="none" stroke="#22f0e6" strokeWidth="1.5" strokeOpacity="0.5" />
      </g>

      {/* Arms */}
      <g stroke="#22f0e6" strokeWidth="2.5" strokeLinecap="round" fill="url(#mm-vest)">
        {/* Left arm (back, holding gun) */}
        <path d="M 155 215 Q 120 230 95 260 Q 88 268 95 275" />
        {/* Right arm */}
        <path d="M 245 215 Q 270 250 260 290 Q 255 300 240 295" />
      </g>
      <g fill="url(#mm-skin)" stroke="#22f0e6" strokeWidth="2" strokeLinejoin="round">
        <ellipse cx="95" cy="278" rx="9" ry="8" />
        <ellipse cx="245" cy="298" rx="9" ry="8" />
      </g>

      {/* Head with helmet */}
      <g>
        {/* Face */}
        <ellipse cx="195" cy="175" rx="28" ry="30" fill="url(#mm-skin)" stroke="#22f0e6" strokeWidth="2.5" />
        {/* Helmet */}
        <path
          d="M 160 160 Q 155 125 195 120 Q 235 125 230 160 Q 230 168 195 168 Q 160 168 160 160 Z"
          fill="#1a3a3d"
          stroke="#22f0e6"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Helmet line */}
        <path d="M 160 155 Q 195 150 230 155" stroke="#22f0e6" strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
        {/* Goggles */}
        <rect x="175" y="168" width="40" height="10" rx="4" fill="#07070d" stroke="#22f0e6" strokeWidth="1.5" />
        <circle cx="185" cy="173" r="3" fill="#22f0e6" opacity="0.6" />
        <circle cx="205" cy="173" r="3" fill="#22f0e6" opacity="0.6" />
        {/* Mouth — determined grin */}
        <path d="M 185 190 Q 195 196 205 190" stroke="#07070d" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Gun */}
      <g>
        {/* Barrel */}
        <rect x="80" y="248" width="40" height="7" rx="2" fill="url(#mm-metal)" stroke="#22f0e6" strokeWidth="1.5" />
        <rect x="75" y="245" width="8" height="13" rx="2" fill="url(#mm-metal)" stroke="#22f0e6" strokeWidth="1.5" />
        {/* Body / receiver */}
        <rect x="118" y="244" width="22" height="16" rx="3" fill="url(#mm-metal)" stroke="#22f0e6" strokeWidth="1.5" />
        {/* Magazine */}
        <rect x="124" y="258" width="10" height="18" rx="2" fill="#1a3a3d" stroke="#22f0e6" strokeWidth="1.5" />
        {/* Scope */}
        <rect x="112" y="238" width="16" height="5" rx="2" fill="url(#mm-metal)" stroke="#22f0e6" strokeWidth="1" />
        <circle cx="112" cy="241" r="3" fill="#22f0e6" opacity="0.7" />
        {/* Trigger guard */}
        <path d="M 128 260 Q 128 268 134 268" stroke="#22f0e6" strokeWidth="1.5" fill="none" />
      </g>

      {/* Muzzle flash accent */}
      <g opacity="0.6">
        <path d="M 70 251 L 58 248 L 70 245 L 67 251 L 72 248" fill="#22f0e6" />
        <circle cx="62" cy="251" r="4" fill="#22f0e6" opacity="0.3" />
      </g>

      {/* Doodle outline accents */}
      <g stroke="#22f0e6" strokeWidth="1" strokeOpacity="0.15" fill="none">
        <path d="M 280 100 Q 300 110 290 130" />
        <path d="M 300 350 Q 320 360 310 380" />
        <path d="M 100 420 Q 120 430 110 450" />
      </g>
    </svg>
  );
}

// Friendly gaming controller + VS esports graphic on neon green background
export function FreeMatchArt({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 400 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="fm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a2e1a" />
          <stop offset="40%" stopColor="#0d4a28" />
          <stop offset="100%" stopColor="#07070d" />
        </linearGradient>
        <radialGradient id="fm-glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#39ff8a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#39ff8a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fm-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3a28" />
          <stop offset="100%" stopColor="#0d2818" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="480" fill="url(#fm-bg)" />
      <rect width="400" height="480" fill="url(#fm-glow)" />

      {/* Doodle grid */}
      <g stroke="#39ff8a" strokeOpacity="0.06" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`fh${i}`} x1="0" y1={i * 60} x2="400" y2={i * 60} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`fv${i}`} x1={i * 60} y1="0" x2={i * 60} y2="480" />
        ))}
      </g>

      {/* Doodle sparkles */}
      <g fill="#39ff8a">
        <circle cx="50" cy="70" r="2.5" opacity="0.5" />
        <circle cx="350" cy="90" r="2" opacity="0.4" />
        <circle cx="370" cy="250" r="2.5" opacity="0.3" />
        <circle cx="30" cy="350" r="2" opacity="0.4" />
        <path d="M 330 180 l 3 -6 l 3 6 l 6 3 l -6 3 l -3 6 l -3 -6 l -6 -3 z" opacity="0.2" />
        <path d="M 60 400 l 2.5 -5 l 2.5 5 l 5 2.5 l -5 2.5 l -2.5 5 l -2.5 -5 l -5 -2.5 z" opacity="0.15" />
      </g>

      {/* VS text — large, bold, neon */}
      <g>
        <text
          x="200"
          y="160"
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="72"
          fontWeight="700"
          fill="#39ff8a"
          stroke="#39ff8a"
          strokeWidth="1"
          style={{ filter: 'drop-shadow(0 0 12px #39ff8a88)' }}
        >
          VS
        </text>
        {/* VS underline doodle */}
        <path
          d="M 140 175 Q 200 170 260 175"
          stroke="#39ff8a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* Game Controller — doodle style */}
      <g transform="translate(200, 320)">
        {/* Controller body */}
        <path
          d="M -80 -30 Q -90 -30 -90 -15 Q -95 10 -80 25 Q -60 40 -30 35 Q 0 32 30 35 Q 60 40 80 25 Q 95 10 90 -15 Q 90 -30 80 -30 L 40 -30 Q 20 -30 0 -30 L -40 -30 Z"
          fill="url(#fm-body)"
          stroke="#39ff8a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Left grip bump */}
        <ellipse cx="-72" cy="15" rx="12" ry="8" fill="#0d2818" stroke="#39ff8a" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Right grip bump */}
        <ellipse cx="72" cy="15" rx="12" ry="8" fill="#0d2818" stroke="#39ff8a" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* D-pad (left) */}
        <g stroke="#39ff8a" strokeWidth="2" strokeLinecap="round">
          <line x1="-55" y1="-8" x2="-55" y2="8" />
          <line x1="-63" y1="0" x2="-47" y2="0" />
        </g>
        <g fill="#39ff8a">
          <circle cx="-55" cy="-8" r="1.5" />
          <circle cx="-55" cy="8" r="1.5" />
          <circle cx="-63" cy="0" r="1.5" />
          <circle cx="-47" cy="0" r="1.5" />
        </g>

        {/* Action buttons (right) — 4 dots */}
        <g fill="#39ff8a" stroke="#39ff8a" strokeWidth="1.5">
          <circle cx="45" cy="-10" r="4" fill="#39ff8a" opacity="0.9" />
          <circle cx="58" cy="-2" r="4" fill="#22f0e6" opacity="0.9" />
          <circle cx="45" cy="6" r="4" fill="#ff3df0" opacity="0.9" />
          <circle cx="32" cy="-2" r="4" fill="#ffe94e" opacity="0.9" />
        </g>

        {/* Center area — small screen / logo */}
        <rect x="-12" y="-12" width="24" height="16" rx="3" fill="#07070d" stroke="#39ff8a" strokeWidth="1.5" />
        <circle cx="0" cy="-4" r="3" fill="#39ff8a" opacity="0.5" />

        {/* Shoulder buttons (top) */}
        <path d="M -60 -32 L -30 -32" stroke="#39ff8a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M 30 -32 L 60 -32" stroke="#39ff8a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

        {/* Connectors/cable doodle */}
        <path d="M 0 -32 Q 0 -45 10 -50 Q 20 -55 15 -65" stroke="#39ff8a" strokeWidth="1.5" fill="none" strokeOpacity="0.3" />
      </g>

      {/* Doodle accent lines */}
      <g stroke="#39ff8a" strokeWidth="1" strokeOpacity="0.12" fill="none">
        <path d="M 290 50 Q 310 60 300 80" />
        <path d="M 80 420 Q 100 430 90 450" />
        <path d="M 320 380 Q 340 390 330 410" />
      </g>
    </svg>
  );
}
