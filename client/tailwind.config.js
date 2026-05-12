/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
        brand: '0 18px 45px rgba(30, 53, 102, 0.16)'
      },
      colors: {
        brand: {
          DEFAULT: '#1e3566',
          dark: '#15264d',
          soft: '#eef3fb',
          gold: '#f2b544'
        }
      }
    }
  },
  plugins: []
};
