/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["\"Source Serif 4\"", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        // Brand — a civic, trustworthy navy/indigo scale used for primary actions and links.
        brand: {
          50: "#eef4ff",
          100: "#dfe9ff",
          200: "#c1d3ff",
          300: "#98b4ff",
          400: "#6c8dff",
          500: "#4361ee",
          600: "#3145d6",
          700: "#2735ad",
          800: "#212c86",
          900: "#1c2568",
          950: "#12163f",
        },
        status: {
          verified: "#166534",
          allegation: "#92400e",
          investigation: "#1d4ed8",
          pending: "#4338ca",
          convicted: "#991b1b",
          acquitted: "#0f766e",
          incarcerated: "#7c2d12",
          unknown: "#374151",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        elevated: "0 4px 6px -2px rgb(15 23 42 / 0.05), 0 10px 15px -3px rgb(15 23 42 / 0.08)",
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
