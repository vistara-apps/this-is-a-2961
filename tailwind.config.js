/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 15%, 95%)',
        accent: 'hsl(170, 70%, 55%)',
        primary: 'hsl(220, 80%, 60%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(220, 15%, 15%)',
        'text-secondary': 'hsl(220, 15%, 40%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 15%, 0.1)',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
    },
  },
  plugins: [],
}