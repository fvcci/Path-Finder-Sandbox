/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#417194",
        selection: "#389fd6",
        "pale-blue": "#355871",
        "dark-blue": "#233342",
        "darkest-blue": "#131c21",
        turquoise: "rgba(0, 190, 218, 0.75)",
        green: "rgba(0, 217, 159, 0.75)",
        blue: "rgba(17, 104, 217, 0.75)",
        yellow: "rgb(255, 254, 106)",
        "weight-1": "rgba(103, 58, 182, 0.75)",
        "weight-2": "rgba(155, 39, 176, 0.75)",
        "weight-3": "rgba(233, 30, 99, 0.75)",
      },
    },
    keyframes: {},
  },
};
