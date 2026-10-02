/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        parchment: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dec8',
          900: '#14120e',
          950: '#0a0907',
        },
        arcane: {
          400: '#a855f7',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        cyber: {
          neon: '#06b6d4',
          amber: '#f59e0b',
          crimson: '#ef4444',
          emerald: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
