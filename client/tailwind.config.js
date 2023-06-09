/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f9f7f9 ",
        secondary: "#dbefe9 ",
        thirdy: "#0e7b52",
        fourthy: "#095236",

        //dark mode
        primaryDark: "#1a2329",
        secondaryDark: "#0a0f12",
        thirdyDark: "#3282B8",
        fourthyDark: "#BBE1FA",
      },
    },
  },
  plugins: [],
};
