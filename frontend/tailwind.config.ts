import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        dancing: ['Dancing Script', 'cursive'],
        greatVibes: ['Great Vibes', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      colors: {
        gold: {
          50:  '#fdf9ed',
          100: '#faf0c9',
          200: '#f5df8e',
          300: '#f0c94e',
          400: '#ecb62b',
          500: '#c9a96e',
          600: '#a07840',
          700: '#7a5530',
          800: '#5c3d23',
          900: '#3d2814',
        },
      },
      animation: {
        'fade-in':    'fadeIn 1s ease-in-out forwards',
        'slide-up':   'slideUp 0.8s ease-out forwards',
        'petal-fall': 'petalFall 6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        petalFall: {
          '0%':   { transform: 'translateY(-10px) rotate(0deg)',   opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
