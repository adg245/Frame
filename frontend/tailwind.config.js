/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg-main':       'var(--bg-main)',
        'bg-secondary':  'var(--bg-secondary)',
        'bg-card':       'var(--bg-card)',
        'bg-elevated':   'var(--bg-elevated)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':    'var(--text-muted)',
        'accent':        'var(--accent)',
        'accent-hover':  'var(--accent-hover)',
        'border-color':  'var(--border)',
      },
      fontFamily: {
        sans:    ['Inter','system-ui','sans-serif'],
        display: ['Playfair Display','Georgia','serif'],
      },
      screens: {
        'xs': '480px',
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
