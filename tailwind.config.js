/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vuegreen: '#42b883',
        vuedark: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
