/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // South Sudan flag colors - tastefully applied
        primary: '#0F47AF',      // Flag blue
        secondary: '#078930',    // Flag green
        accent: '#FCDD09',       // Flag yellow/gold
        dark: '#000000',         // Flag black
        danger: '#DA121A',       // Flag red
      }
    },
  },
  plugins: [],
}
