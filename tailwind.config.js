/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {
      colors: {
        zinc: {
          150: '#ededf0',
          450: '#898e9a',
          550: '#52525b',
          650: '#3f3f46',
          850: '#1e1e22'
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          650: '#d9520a',
          655: '#d44f09',
          700: '#c2410c',
          850: '#7c2d12',
          900: '#7c2d12'
        },
        accentBlue: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          400: '#22d3ee',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          850: '#164e63'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif']
      }
    }
  },
  plugins: []
}
