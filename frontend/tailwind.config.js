/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f9',
          100: '#e1e9f2',
          200: '#b8ccdf',
          300: '#90b0cc',
          400: '#6793b8',
          500: '#1d5e93', // Trustworthy deep blue
          600: '#1a5484',
          700: '#16476e',
          800: '#113857',
          900: '#0e2b43',
        },
        accent: {
          50: '#f0faf6',
          100: '#def5ec',
          200: '#bcead8',
          300: '#9addc4',
          400: '#77d0b0',
          500: '#0f9f6e', // Clean, calming emerald green
          600: '#0d8c61',
          700: '#0a7551',
          800: '#085e41',
          900: '#064932',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}
