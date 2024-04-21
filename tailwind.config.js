/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          button: "#389fd6",
          primary: {
            1: "#417194",
            2: "#355871",
            3: "#233342",
            4: "#131c21",
          },
        },
        node: {
          "shortest-path": "rgb(255, 254, 106)",
          visited: {
            1: "rgba(17, 104, 217, 0.75)",
            2: "rgba(0, 217, 159, 0.75)",
            3: "rgba(0, 190, 218, 0.75)",
          },
          wall: "#355871",
          weight: {
            1: "rgba(103, 58, 182, 0.75)",
            2: "rgba(155, 39, 176, 0.75)",
            3: "rgba(233, 30, 99, 0.75)",
          },
        },
      },
    },
    keyframes: {
      "pop-in-node": {
        "0%": { transform: "scale(0.3)" },
        "50%": { transform: "scale(1.2)" },
        "100%": { transform: "scale(1)" },
      },
      "pop-out-node": {
        "0%": { transform: "scale(1)" },
        "33%": { transform: "scale(1.2)" },
        "66%": { transform: "scale(0.3)" },
        "100%": { transform: "scale(0)" },
      },
      "destination-node": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.3)" },
        "100%": { transform: "scale(1)" },
      },
      "visited-node-appear": {
        "25%": {
          transform: "scale(0.3)",
          borderRadius: "100%",
        },
        "50%": {
          backgroundColor: "theme('colors.node.visited.1')",
        },
        "75%": {
          transform: "scale(1.2)",
          backgroundColor: "theme('colors.node.visited.2')",
        },
        "100%": {
          transform: "scale(1)",
          backgroundColor: "theme('colors.node.visited.3')",
        },
      },
      "visited-node-disappear": {
        "25%": {
          backgroundColor: "theme('colors.node.visited.3')",
        },
        "50%": {
          backgroundColor: "theme('colors.node.visited.2')",
        },
        "75%": {
          backgroundColor: "theme('colors.node.visited.1')",
        },
        "100%": {
          backgroundColor: "none",
        },
      },
      "shortest-path-node-appear": {
        "0%": {
          backgroundColor: "theme('colors.node.visited.2')",
        },
        "80%": {
          backgroundColor: "theme('colors.node.shortest-path')",
          transform: "scale(1.3)",
        },
        "100%": {
          backgroundColor: "theme('colors.node.shortest-path')",
          transform: "scale(1)",
        },
      },
      "shortest-path-node-disappear": {
        "0%": {
          backgroundColor: "theme('colors.node.shortest-path')",
        },
        "20%": {
          backgroundColor: "theme('colors.node.visited.2')",
        },
        "40%": {
          backgroundColor: "theme('colors.node.visited.1')",
        },
        "60%": {
          backgroundColor: "none",
        },
      },
    },
    animation: {
      "pop-in-node": "pop-in-node 0.3s ease 0s 1 normal forwards running",
      "pop-out-node": "pop-out-node 0.3s ease 0s 1 normal forwards running",
      "visited-node-appear":
        "visited-node-appear 2s ease 0s 1 normal forwards running",
      "visited-node-disappear":
        "visited-node-disappear 1.5s ease 0s 1 normal forwards running",
      "shortest-path-node-appear":
        "shortest-path-node-appear 1.5s ease 0s 1 normal forwards running",
      "shortest-path-node-disappear":
        "shortest-path-node-disappear 1.5s ease 0s 1 normal forwards running",
      "destination-node":
        "destination-node 0.3s ease 0s 1 normal forwards running",
    },
  },
};
