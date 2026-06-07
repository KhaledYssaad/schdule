/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#001f3f",
        primary: {
          50: "#f0f5ff",
          100: "#e0ebff",
          200: "#c2d9ff",
          300: "#a3c7ff",
          400: "#84b5ff",
          500: "#2563eb", // Vibrant Blue
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
        },
      },
      fontFamily: {
        sans: [
          '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"',
        ],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 31, 63, 0.08)",
        "soft-lg": "0 8px 24px rgba(0, 31, 63, 0.12)",
        "soft-xl": "0 12px 32px rgba(0, 31, 63, 0.16)",
      },
      animation: {
        "bounce-soft": "bounce-soft 1s infinite",
        "fade-in": "fade-in 0.3s ease-in",
      },
      keyframes: {
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
