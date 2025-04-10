/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Charm', 'cursive'],
        'quintessential': ['Quintessential', 'cursive'],
        'korean': ['Diphylleia', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
} 