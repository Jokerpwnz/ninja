module.exports = {
  purge: { content: ["./public/**/*.html","./src/**/*.vue"]},
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    display: ['responsive', 'dropdown'],
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"),require('autoprefixer'),require('tailwindcss-dropdown')],
}
