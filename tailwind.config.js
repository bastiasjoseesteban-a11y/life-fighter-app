/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Añade estos colores basados en tu globals.css
        'lf-bg-primary': '#0A0A0F',
        'lf-bg-secondary': '#1A1A23',
        'lf-accent': '#00F0FF',
        'lf-accent-glow': 'rgba(0, 240, 255, 0.5)',
        'lf-secondary': '#FF004D',
        'lf-success': '#00FF9D',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'swipe-hint': 'swipeHint 2s ease-in-out infinite',
        'fade-in-out': 'fadeInOut 3s ease-in-out',
        'page-fade': 'pageFade 0.3s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'swipeHint': {
          '0%': { opacity: 0, transform: 'translateX(-100%)' },
          '50%': { opacity: 0.7, transform: 'translateX(0%)' },
          '100%': { opacity: 0, transform: 'translateX(100%)' },
        },
        'fadeInOut': {
          '0%, 100%': { 
            opacity: 0, 
            transform: 'translateX(-50%) translateY(10px)' 
          },
          '10%, 90%': { 
            opacity: 1, 
            transform: 'translateX(-50%) translateY(0)' 
          },
        },
        'pageFade': {
          'from': { opacity: 0.8 },
          'to': { opacity: 1 },
        }
      },
      boxShadow: {
        'lf-glow': '0 0 15px rgba(0, 251, 255, 0.5)',
        'lf-glow-lg': '0 0 30px rgba(0, 251, 255, 0.5)',
        'lf-glow-xl': '0 0 40px rgba(0, 251, 255, 0.5)',
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      // Soporte para pantallas con altura específica
      screens: {
        'short': { 'raw': '(max-height: 700px)' },
        'tall': { 'raw': '(min-height: 701px)' },
        'xs': '475px',
      }
    },
  },
  plugins: [],
}