/** @type {import('tailwindcss').Config} */

const LOCAL_COLORS = {
  VISITED_NODE_1: "rgba(17, 104, 217, 0.75)",
  VISITED_NODE_2: "rgba(0, 217, 159, 0.75)",
  VISITED_NODE_3: "rgba(0, 190, 218, 0.75)",
  SHORTEST_PATH: "rgb(255, 254, 106)",
  WEIGHT_1: "rgba(103, 58, 182, 0.75)",
  WEIGHT_2: "rgba(155, 39, 176, 0.75)",
  WEIGHT_3: "rgba(233, 30, 99, 0.75)",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        button: "#389fd6",
        "primary-1": "#417194",
        "primary-2": "#355871",
        "primary-3": "#233342",
        "primary-4": "#131c21",
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
          backgroundColor: LOCAL_COLORS.VISITED_NODE_1,
        },
        "75%": {
          transform: "scale(1.2)",
          backgroundColor: LOCAL_COLORS.VISITED_NODE_2,
        },
        "100%": {
          transform: "scale(1)",
          backgroundColor: LOCAL_COLORS.VISITED_NODE_3,
        },
      },
      "visited-node-disappear": {
        "25%": {
          backgroundColor: LOCAL_COLORS.VISITED_NODE_3,
        },
        "50%": {
          backgroundColor: LOCAL_COLORS.VISITED_NODE_2,
        },
        "75%": {
          backgroundColor: LOCAL_COLORS.VISITED_NODE_1,
        },
        "100%": {
          backgroundColor: "none",
        },
      },
      "shortest-path-node-appear": {
        "0%": {
          backgroundColor: LOCAL_COLORS.VISITED_NODE_2,
        },
        "80%": {
          backgroundColor: LOCAL_COLORS.SHORTEST_PATH,
          transform: "scale(1.3)",
        },
        "100%": {
          transform: "scale(1)",
        },
      },
      "shortest-path-node-disappear": {
        "0%": {
          backgroundColor: LOCAL_COLORS.SHORTEST_PATH,
        },
        "20%": {
          backgroundColor: LOCAL_COLORS.VISITED_NODE_2,
        },
        "40%": {
          backgroundColor: LOCAL_COLORS.VISITED_NODE_1,
        },
        "60%": {
          backgroundColor: "none",
        },
      },
    },
    animation: {
      "pop-in-node": "pop-in-node 0.3s ease 0s 1 normal both running",
      "pop-out-node": "pop-out-node 0.3s ease 0s 1 normal both running",
      "visited-node-appear":
        "visited-node-appear 2s ease 0s 1 normal both running",
      "visited-node-disappear":
        "visited-node-disappear 1.5s ease 0s 1 normal both running",
      "shortest-path-node-appear":
        "shortest-path-node-appear 1.5s ease 0s 1 normal both running",
      "shortest-path-node-disappear":
        "shortest-path-node-disappear 1.5s ease 0s 1 normal both running",
      "destination-node": "destination-node 0.3s ease 0s 1 normal both running",
    },
  },
};
