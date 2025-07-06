/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'slate': {
          800: '#1e293b',
          900: '#0f172a',
        },
        'emerald': {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        'orange': {
          500: '#eab308',
          600: '#ca8a04',
        },
        'yellow': {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        'purple': {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        'pink': {
          500: '#ec4899',
          600: '#db2777',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};