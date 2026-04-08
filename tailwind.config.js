/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}