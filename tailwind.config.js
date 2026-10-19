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
        brand: {
          50: 'var(--brand-50, #eef2ff)',
          100: 'var(--brand-100, #e0e7ff)',
          200: 'var(--brand-200, #c7d2fe)',
          300: 'var(--brand-300, #a5b4fc)',
          400: 'var(--brand-400, #818cf8)',
          500: 'var(--brand-500, #6366f1)',
          600: 'var(--brand-600, #4f46e5)',
          700: 'var(--brand-700, #4338ca)',
          800: 'var(--brand-800, #3730a3)',
          900: 'var(--brand-900, #312e81)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
