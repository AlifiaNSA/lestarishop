/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#c1e8ef36", // Biru muda transparan
        secondary: "#43c2d1", // Biru cerah
        tertiary: "#272626", // Abu gelap mendekati hitam
        gray: {
          10: "#EEEEEE", // Abu sangat terang
          20: "#A2A2A2", // Abu terang
          30: "#7B7B7B", // Abu medium
          50: "#585858", // Abu gelap
          90: "#141414", // Hampir hitam
        },
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
      },
      backgroundImage: {
        hero: "url(/src/assets/bg.png)",
        banner: "url(/src/assets/banner.png)"
      },
    },
  },
  plugins: [],
}
