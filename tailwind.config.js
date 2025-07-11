/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0066FF',
        'brand-secondary': '#00D4FF',
        'success': '#00C851',
        'danger': '#FF4444',
        'warning': '#FFBB33',
      },
    },
  },
  plugins: [],
}
