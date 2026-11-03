/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        champagne: '#E0C97E',
        butter: '#FCF8B3',
        coral: '#FB9378',
        mauve: '#AB6088',
        midnight: {
          DEFAULT: '#090A0D',
          light: '#111217',
          elevated: '#171821'
        },
        brand: {
          50: '#fdfbf2',
          100: '#faf5de',
          200: '#f4e9b9',
          300: '#ebd78b',
          400: '#E0C97E',
          500: '#d4b761',
          600: '#bc9c4a',
          700: '#9c7d3b',
          800: '#806434',
          900: '#6b532f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
