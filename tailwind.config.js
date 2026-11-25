/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        fpSage: '#DCE7D0',
        fpOlive: '#5A6552',
        fpGreen: '#3B7A57',
        fpRed: '#C93B2B',
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', '"Inter"', 'sans-serif'],
        heading: ['"Outfit"', '"Inter"', 'sans-serif'],
        display: ['"Outfit"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
