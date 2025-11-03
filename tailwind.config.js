/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-pink': '#FF005C',
        'neo-cyan': '#00F0FF',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-[#FF005C]',
    'bg-[#00F0FF]',
    'bg-yellow-300',
    'text-white',
    'text-black',
  ]
}
