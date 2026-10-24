type LogoProps = {
  className?: string;
};

// Custom DoodleX logo: a neon cyan soldier helmet overlapping with a pink Ludo dice
export function DoodleXLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-helmet" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22f0e6" />
          <stop offset="100%" stopColor="#0a9e98" />
        </linearGradient>
        <linearGradient id="logo-dice" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3df0" />
          <stop offset="100%" stopColor="#a01498" />
        </linearGradient>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ludo dice (back, bottom-right, pink) */}
      <g filter="url(#logo-glow)">
        <rect
          x="20"
          y="18"
          width="20"
          height="20"
          rx="4"
          fill="url(#logo-dice)"
          stroke="#ff77f5"
          strokeWidth="1"
          opacity="0.95"
          transform="rotate(-6 30 28)"
        />
        {/* Dice pips */}
        <g fill="#07070d" opacity="0.85" transform="rotate(-6 30 28)">
          <circle cx="25" cy="23" r="1.5" />
          <circle cx="35" cy="23" r="1.5" />
          <circle cx="30" cy="28" r="1.5" />
          <circle cx="25" cy="33" r="1.5" />
          <circle cx="35" cy="33" r="1.5" />
        </g>
        {/* Highlight edge */}
        <rect
          x="20"
          y="18"
          width="20"
          height="20"
          rx="4"
          fill="none"
          stroke="#ffa3f7"
          strokeWidth="0.8"
          opacity="0.5"
          transform="rotate(-6 30 28)"
        />
      </g>

      {/* Soldier helmet (front, top-left, cyan) */}
      <g filter="url(#logo-glow)">
        {/* Helmet dome */}
        <path
          d="M 5 26 Q 4 12 18 10 Q 32 12 31 26 L 31 27 Q 18 30 5 27 Z"
          fill="url(#logo-helmet)"
          stroke="#7df9f3"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Helmet rim */}
        <rect
          x="5"
          y="25"
          width="26"
          height="3"
          rx="1.5"
          fill="#0a9e98"
          stroke="#7df9f3"
          strokeWidth="0.8"
        />
        {/* Helmet stripe */}
        <path
          d="M 18 10 Q 20 18 18 27"
          stroke="#07070d"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.4"
        />
        {/* Star on helmet */}
        <path
          d="M 18 15 l 1.5 -3 l 1.5 3 l 3 1 l -3 1 l -1.5 3 l -1.5 -3 l -3 -1 z"
          fill="#07070d"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
