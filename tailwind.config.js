/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "purple-dark": "#015487",
        "purple-light": "#E6F0F7",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
