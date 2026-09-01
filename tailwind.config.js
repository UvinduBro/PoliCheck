import typography from "@tailwindcss/typography";

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
        // CivicLens design tokens — backed by CSS custom properties (src/styles/index.css)
        // so both themes are defined once and consumed everywhere via these semantic names.
        bg: "rgb(var(--cl-bg) / <alpha-value>)",
        surface: "rgb(var(--cl-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--cl-surface-2) / <alpha-value>)",
        elevated: "rgb(var(--cl-elevated) / <alpha-value>)",
        ink: "rgb(var(--cl-ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--cl-ink-muted) / <alpha-value>)",
        "ink-faint": "rgb(var(--cl-ink-faint) / <alpha-value>)",
        line: "rgb(var(--cl-line) / <alpha-value>)",
        "line-strong": "rgb(var(--cl-line-strong) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--cl-accent) / <alpha-value>)",
          fg: "rgb(var(--cl-accent-fg) / <alpha-value>)",
          50: "#eef1ff",
          100: "#e0e5ff",
          200: "#c6ccff",
          300: "#a3a9fb",
          400: "#7d80f2",
          500: "#5b5de0",
          600: "#4744c9",
          700: "#3a37a4",
          800: "#312f83",
          900: "#2a2968",
          950: "#191840",
        },
        status: {
          verified: "rgb(var(--cl-status-verified) / <alpha-value>)",
          "verified-bg": "rgb(var(--cl-status-verified-bg) / <alpha-value>)",
          pending: "rgb(var(--cl-status-pending) / <alpha-value>)",
          "pending-bg": "rgb(var(--cl-status-pending-bg) / <alpha-value>)",
          critical: "rgb(var(--cl-status-critical) / <alpha-value>)",
          "critical-bg": "rgb(var(--cl-status-critical-bg) / <alpha-value>)",
          info: "rgb(var(--cl-status-info) / <alpha-value>)",
          "info-bg": "rgb(var(--cl-status-info-bg) / <alpha-value>)",
          neutral: "rgb(var(--cl-status-neutral) / <alpha-value>)",
          "neutral-bg": "rgb(var(--cl-status-neutral-bg) / <alpha-value>)",
        },
        // Retained brand/slate scales — the existing neutral palette (Tailwind slate) is
        // already a near-exact match for the spec's suggested light/dark neutrals, so
        // form pages and other not-yet-migrated surfaces keep visual continuity.
        brand: {
          50: "#eef1ff",
          100: "#e0e5ff",
          200: "#c6ccff",
          300: "#a3a9fb",
          400: "#7d80f2",
          500: "#5b5de0",
          600: "#4744c9",
          700: "#3a37a4",
          800: "#312f83",
          900: "#2a2968",
          950: "#191840",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        elevated: "0 4px 6px -2px rgb(15 23 42 / 0.05), 0 10px 15px -3px rgb(15 23 42 / 0.08)",
        premium: "0 8px 24px -8px rgb(15 23 42 / 0.12), 0 2px 8px -2px rgb(15 23 42 / 0.06)",
      },
      fontSize: {
        "hero-mobile": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        hero: ["3.5rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "page-heading": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "section-heading": ["1.375rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "scale-in": "scale-in 150ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography],
};
