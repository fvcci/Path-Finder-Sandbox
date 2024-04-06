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
    keyframes: {
      popInNode: {
        "0%": { transform: "scale(0.3)" },
        "50%": { transform: "scale(1.2)" },
        "100%": { transform: "scale(1)" },
      },
      popOutNode: {
        "0%": { transform: "scale(1)" },
        "33%": { transform: "scale(1.2)" },
        "66%": { transform: "scale(0.3)" },
        "100%": { transform: "scale(0)" },
      },

      visitedNodeAppear: {
        "25%": {
          transform: "scale(0.3)",
          borderRadius: "100%",
        },
        "50%": {
          backgroundColor: "var(--blue)",
        },
        "75%": {
          transform: "scale(1.2)",
          backgroundColor: "var(--green)",
        },
        "100%": {
          transform: "scale(1)",
          backgroundColor: "var(--turquoise)",
        },
      },
      visitedNodeDisappear: {
        "25%": {
          backgroundColor: "var(--turquoise)",
        },
        "50%": {
          backgroundColor: "var(--green)",
        },
        "75%": {
          backgroundColor: "var(--blue)",
        },
        "100%": {
          backgroundColor: "none",
        },
      },

      shortestPathNodeAppear: {
        "0%": {
          backgroundColor: "var(--green)",
        },
        "80%": {
          backgroundColor: "var(--yellow)",
          transform: "scale(1.3)",
        },
        "100%": {
          transform: "scale(1)",
        },
      },
      shortestPathNodeDisappear: {
        "0%": {
          backgroundColor: "var(--yellow)",
        },
        "20%": {
          backgroundColor: "var(--green)",
        },
        "40%": {
          backgroundColor: "var(--blue)",
        },
        "60%": {
          backgroundColor: "none",
        },
      },
    },
  },
};
