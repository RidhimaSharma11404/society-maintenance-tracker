/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#EEF2F6',
        ink: {
          DEFAULT: '#16233D',
          dark: '#0E1729',
          light: '#253556'
        },
        steel: {
          DEFAULT: '#6E7C90',
          50: '#F7F9FB',
          100: '#E8EDF2',
          200: '#D1DBE5',
          300: '#B0BFCF',
          400: '#8E9FB5',
          500: '#6E7C90',
          600: '#546174',
          700: '#3D4757',
          800: '#28303C',
          900: '#16233D'
        },
        amber: {
          signal: '#E8A33D',
          DEFAULT: '#E8A33D'
        },
        red: {
          alert: '#C6433D',
          DEFAULT: '#C6433D'
        },
        green: {
          verified: '#2E8B63',
          DEFAULT: '#2E8B63'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        'none': 'none'
      }
    },
  },
  plugins: [],
}
