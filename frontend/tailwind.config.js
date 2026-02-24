/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#1A1A2E',
        accent: '#FFF3ED',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        border: '#E5E7EB',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
