/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,html}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      colors: {
        ink: "#0c0f14",
        mist: "#f2efe8",
        ember: "#f97316",
        lagoon: "#0f766e",
        haze: "#f6f1ea"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 118, 110, 0.25)",
        ember: "0 18px 50px rgba(249, 115, 22, 0.35)"
      }
    }
  },
  plugins: []
};
