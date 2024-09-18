/** @type {import("tailwindcss").Config} */

export default {
  darkMode: ["class"],
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    keyframes: {
      "pop-in-node": {
        "0%": {
          transform: "scale(0.3)",
        },
        "50%": {
          transform: "scale(1.2)",
        },
        "100%": {
          transform: "scale(1)",
        },
      },
      "pop-out-node": {
        "0%": {
          transform: "scale(1)",
        },
        "33%": {
          transform: "scale(1.2)",
        },
        "66%": {
          transform: "scale(0.3)",
        },
        "100%": {
          transform: "scale(0)",
        },
      },
      "destination-node": {
        "0%": {
          transform: "scale(1)",
        },
        "50%": {
          transform: "scale(1.3)",
        },
        "100%": {
          transform: "scale(1)",
        },
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
      "visited-node-vanish": {
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
      "shortest-path-node-vanish": {
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
      "visited-node-vanish":
        "visited-node-vanish 1.5s ease 0s 1 normal forwards running",
      "shortest-path-node-appear":
        "shortest-path-node-appear 1.5s ease 0s 1 normal forwards running",
      "shortest-path-node-vanish":
        "shortest-path-node-vanish 1.5s ease 0s 1 normal forwards running",
      "destination-node":
        "destination-node 0.3s ease 0s 1 normal forwards running",
    },
  },
};
