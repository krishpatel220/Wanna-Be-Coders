/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-twilight': '#03045E',
        'bright-teal': '#0077B6',
        'turquoise-surf': '#00B4D8',
        'frosted-blue': '#90E0EF',
        'light-cyan': '#CAF0F8',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '20px',
        '3xl': '32px',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 119, 182, 0.15)',
        'glow': '0 0 40px rgba(0, 180, 216, 0.2)',
        'card': '0 8px 32px rgba(3, 4, 94, 0.08)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'plane-fly': 'planeFly 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        planeFly: {
          '0%': { transform: 'translateX(-10px) translateY(5px)' },
          '50%': { transform: 'translateX(10px) translateY(-5px)' },
          '100%': { transform: 'translateX(-10px) translateY(5px)' },
        },
      },
    },
  },
  plugins: [],
}
