/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#03050a',
          900: '#070b14',
          850: '#0a1020',
          800: '#0d152a',
          700: '#14203e',
        },
        cyan: {
          DEFAULT: '#00f3ff',
          light: '#67f7ff',
          dark: '#00b4bd',
          glow: 'rgba(0, 243, 255, 0.6)',
        },
        purple: {
          DEFAULT: '#b026ff',
          light: '#d26dff',
          dark: '#7e0bb8',
          glow: 'rgba(176, 38, 255, 0.6)',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 243, 255, 0.45)',
        'glow-cyan-lg': '0 0 45px rgba(0, 243, 255, 0.6)',
        'glow-purple': '0 0 25px rgba(176, 38, 255, 0.45)',
        'glow-purple-lg': '0 0 45px rgba(176, 38, 255, 0.6)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      fontFamily: {
        gaming: ['Orbitron', 'Rajdhani', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatRev 10s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(15px) rotate(-3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

