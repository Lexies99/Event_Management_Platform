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
        slateDeep: '#354649',
        slateCool: '#6C7A89',
        sageAqua: '#A3C6C4',
        mistFrost: '#E0E7E9',
        champagne: '#A3C6C4',
        butter: '#E0E7E9',
        coral: '#6C7A89',
        mauve: '#354649',
        body: '#121819',
        surface: '#1a2325',
        midnight: {
          DEFAULT: '#121819',
          light: '#1a2325',
          elevated: '#243033'
        },
        brand: {
          50: '#f4f7f7',
          100: '#e4ebec',
          200: '#cddadb',
          300: '#A3C6C4',
          400: '#6C7A89',
          500: '#354649',
          600: '#2c3b3e',
          700: '#233032',
          800: '#1c2628',
          900: '#121819',
        }
      },
      fontFamily: {
        sans: ['"Roboto"', 'system-ui', 'sans-serif'],
        body: ['"Roboto"', 'sans-serif'],
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
