/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        wf: {
          'bg-primary': '#0D0D0F',
          'bg-secondary': '#141417',
          'bg-elevated': '#1C1C21',
          'text-primary': '#F2F2F5',
          'text-muted': '#8A8A9A',
          'text-faint': '#4A4A5A',
          accent: '#7C5CBF',
          'accent-light': '#A47FE0',
          watched: '#22C97A',
          'watched-bg': '#0D2B1F',
          next: '#7C5CBF',
          'next-bg': '#1A1230',
          upcoming: '#3A3A45',
          'upcoming-bg': '#141417',
          border: '#2A2A35',
        },
      },
    },
  },
  plugins: [],
}
