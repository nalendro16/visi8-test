/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    fontFamily: {
      inter: ['Inter'],
    },
    extend: {
      fontFamily: {
        inter: ['Inter'],
        'inter-sb': ['Inter-SB'],
        comic: ['Comic'],
      },
      colors: {
        main: {
          error: { 100: '#DF1C41' },
          neutral: { 10: '#EAE9E9', 50: '#959697' },
          black: { 100: '#020202', primary: '#020202' },
          green: { 100: '#3FA535', disabled: '#A3D69D' },
          outline: { input: '#D5D5D5' },
        },
      },
    },
  },
  plugins: [],
}
