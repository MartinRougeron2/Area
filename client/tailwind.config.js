module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'md': {'max': '900px'},
    },
    colors : {
      dark : "#224F81",
      light : "#6592A0",
      red: "#E00016",
      brown: "#C2B6A4",
      white : "#FFFFFF",
      black: "#000000",
    },
    fontSize: {
      sm : "1rem",
      md : "1.5rem",
      lg : "2rem",
      xl : "2.6rem",
      '2xl' : "3.2rem",
    },
    extend: {},
  },
  purge: {
    // content: [
    //   "./pages/**/*.{js,ts,jsx,tsx}",
    //   "./components/**/*.{js,ts,jsx,tsx}",
    // ],
    // These options are passed through directly to PurgeCSS
    options: {
      // List your classes here, or you can even use RegExp
      safelist: ['bg-red', 'bg-dark', 'bg-light', 'bg-brown', 'border-red', 'border-dark', 'border-light', 'border-brown', 'hover:text-red', 'hover:text-dark', 'hover:text-light', 'hover:text-brown'],
      blocklist: [/^debug-/],
      keyframes: true,
      fontFace: true,
    },
  },
  plugins: [],
}
