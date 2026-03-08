/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      borderRadius: {
        "3xl": "1.75rem",
      },
      boxShadow: {
        "luxury-card": "0 30px 80px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

