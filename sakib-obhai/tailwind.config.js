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
        obhai: {
          green: '#00a859',
          'green-dark': '#008746',
          'green-light': '#e6f7ef',
          yellow: '#ffc800',
          'yellow-light': '#fffbeb',
          dark: '#0b1320',
          card: '#142238',
        }
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
