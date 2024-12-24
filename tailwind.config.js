/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [],
};

/* Add these to your existing Tailwind extend configuration */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        acorn: ['Acorn', 'sans-serif'],
      },
    },
  },
}
