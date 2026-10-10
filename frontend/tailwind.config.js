/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f7f3eb',
          200: '#efe6d5',
          300: '#e3d2b7',
          400: '#d2b791',
          500: '#c29c6f',
        }
      }
    },
  },
  plugins: [],
}

