/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b", // สี Slate 800 ตามสไตล์เว็บ TCL
        accent: "#e11d48",  // สี Rose 600 สำหรับจุดเด่น
      },
    },
  },
  plugins: [],
}