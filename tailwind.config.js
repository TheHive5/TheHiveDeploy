/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          50: '#FFFBF0',
          100: '#FFF8E1',
          200: '#FFE8A8',
          300: '#FFD96F',
          400: '#FFCA36',
          500: '#FDB913',
          600: '#DFA01A',
          700: '#B8821F',
          800: '#8B6116',
          900: '#5F410D',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      animation: {
        'bee-pulse': 'beePulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bee-glow': 'beeGlow 2s ease-in-out infinite',
        'bee-buzz': 'beeBuzz 0.2s cubic-bezier(0.36, 0, 0.66, 1) infinite',
        'honeycomb-float': 'honeycombFloat 3s ease-in-out infinite',
      },
      keyframes: {
        beePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        beeGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(253, 185, 19, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(253, 185, 19, 0.8)' },
        },
        beeBuzz: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1px)' },
          '75%': { transform: 'translateX(1px)' },
        },
        honeycombFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      clipPath: {
        hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      },
    },
  },
  plugins: [],
};