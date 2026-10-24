/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#07070d',
          800: '#0c0c16',
          700: '#13131f',
          600: '#1b1b2b',
          500: '#262638',
        },
        neon: {
          cyan: '#22f0e6',
          green: '#39ff8a',
          pink: '#ff3df0',
          yellow: '#ffe94e',
          red: '#ff4d5e',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(34,240,230,0.35), 0 0 40px rgba(34,240,230,0.15)',
        'neon-green': '0 0 20px rgba(57,255,138,0.35), 0 0 40px rgba(57,255,138,0.15)',
        'neon-pink': '0 0 20px rgba(255,61,240,0.35), 0 0 40px rgba(255,61,240,0.15)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'marquee': 'marquee 18s linear infinite',
        'float-in': 'float-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
