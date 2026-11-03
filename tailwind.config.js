/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFBE8',
          100: '#F5F0D8',
          200: '#F0EBD0',
          300: '#E8E3C8',
          400: '#DDD8C0',
        },
        olive: {
          50: '#F0F4A9',
          100: '#E8EC9A',
          200: '#D8DC85',
          300: '#C0C46F',
          400: '#A8AC5A',
          500: '#77734B',
          600: '#656140',
          700: '#534F35',
          800: '#413E2A',
          900: '#30291F',
        },
        brown: {
          50: '#F5EDE5',
          100: '#E8DDD3',
          200: '#D4C4B4',
          300: '#B8A08A',
          400: '#9A7E66',
          500: '#76543E',
          600: '#634634',
          700: '#50392A',
          800: '#3D2C20',
          900: '#30291F',
        },
        ivory: {
          50: '#FFFDF5',
          100: '#FFFBE8',
          200: '#FFF9E0',
          300: '#FFF7D8',
          400: '#FFF5D0',
        },
        text: {
          primary: '#30291F',
          secondary: '#76543E',
          muted: '#77734B',
        },
        highlight: {
          50: '#F5F9B8',
          100: '#F0F4A9',
          200: '#E8EC95',
          300: '#DCE37D',
        },
        brand: {
          ivory: '#F4E9C7',
          cream: '#F8F1D9',
          walnut: '#70503A',
          olive: '#626444',
          beige: '#C6B58A',
          darkOlive: '#383723',
          card: '#EFE3C3',
          buttonOlive: '#5A603E',
          buttonHover: '#4A5032',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}