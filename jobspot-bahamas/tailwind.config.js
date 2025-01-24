/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bahamas-aqua': '#00A7E1',
        'bahamas-gold': '#FFA400',
        'bahamas-black': '#2C3E50',
      },
    },
  },
  plugins: [],
}

