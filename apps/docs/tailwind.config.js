/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'Consolas', 'monospace'],
      },
      // Override Tailwind's blue with OULDS primitive blue scale
      colors: {
        blue: {
          50:  '#EFF8FF',
          100: '#DAF0FF',
          200: '#BDE5FF',
          300: '#90D6FF',
          400: '#5CC0FF',
          500: '#0A99FF',
          600: '#005999',
          700: '#004D85',
          800: '#00406D',
          900: '#00365A',
          950: '#00233C',
        },
      },
    },
  },
  plugins: [],
}
