/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kirei brand palette
        kirei: {
          rose:    '#E8A4B8',
          blush:   '#F5D6E0',
          cream:   '#FDF8F5',
          sage:    '#8BAF8E',
          charcoal:'#2C2C2C',
          deep:    '#1A1A2E',
          gold:    '#C9A96E',
          pink:    '#D4527A',
        },
        // OfferMatrix brand palette
        om: {
          blue:    '#1E3A8A',
          indigo:  '#4F46E5',
          cyan:    '#0891B2',
          green:   '#059669',
          amber:   '#D97706',
          red:     '#DC2626',
          light:   '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
