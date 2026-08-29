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
          // Saffron orange primary scheme for public-service portal look
          50: '#fffdfb',
          100: '#fff3e0',
          200: '#ffe0b2',
          300: '#ffcc80',
          400: '#ffb74d',
          500: '#f57c00', // Saffron Orange
          600: '#e65100', // Deep Saffron Accent
          700: '#d84315',
          800: '#bf360c',
          900: '#3e2723',
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
