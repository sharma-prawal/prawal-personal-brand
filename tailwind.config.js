/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-muted": "var(--ink-muted)",
        paper: "var(--paper)",
        "brand-green": "var(--green)",
        "brand-wine": "var(--wine)",
        "brand-gold": "var(--gold)",
        "surface-glass": "rgba(255,255,255,0.04)",
        "surface-glass-strong": "rgba(255,255,255,0.07)",
        "border-glass": "rgba(255,255,255,0.08)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        premium: "var(--shadow-soft)",
        lift: "var(--shadow-lift)"
      },
      transitionTimingFunction: {
        premium: "var(--ease)"
      }
    }
  },
  plugins: []
};
