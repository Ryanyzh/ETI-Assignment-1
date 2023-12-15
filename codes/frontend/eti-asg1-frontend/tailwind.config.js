/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'red': '#EF233C',
      'black': '#2B2D42',
      'dark-gray': '#8D99AE',
      'light-gray': '#DFE3E8',
      'white': '#FFFFFF',
    },
    extend: {
      fontFamily: {
        rubik: ['Rubik', ...defaultTheme.fontFamily.sans],
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
  ],
}

