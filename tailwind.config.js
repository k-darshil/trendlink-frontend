// tailwind.config.js
// Tells Tailwind CSS which files to scan for class names.
// Tailwind removes unused CSS at build time — it only keeps classes it finds here.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
