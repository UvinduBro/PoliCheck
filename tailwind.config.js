/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
    },
  },
  plugins: [],
};
