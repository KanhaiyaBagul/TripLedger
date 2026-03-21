import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm ivory base
        ivory: {
          50: '#FEFEFE',
          100: '#FAFAF7',
          200: '#F5F4EF',
          300: '#F0EFE9',
          400: '#E8E6DE',
          500: '#D9D6CC',
          600: '#C4C0B3',
        },
        // Warm charcoal text
        charcoal: {
          50: '#F7F6F5',
          100: '#EEECEB',
          300: '#B0AEAD',
          500: '#6B6866',
          700: '#3D3B39',
          900: '#1A1A1A',
        },
        // Warm gold accent
        gold: {
          100: '#FDF6E3',
          200: '#F7E6B4',
          300: '#E8C76A',
          400: '#D4A843',
          500: '#C9A84C',
          600: '#A8882E',
          700: '#856B1E',
        },
        // Sage green — positive / settled
        sage: {
          100: '#EDF3EE',
          200: '#C8DACC',
          300: '#9BBC9F',
          400: '#6B8F71',
          500: '#4F7256',
          600: '#3A5840',
        },
        // Terracotta — alerts / owes money
        terra: {
          100: '#FAF0EB',
          200: '#F0C9B5',
          300: '#DF9A7A',
          400: '#C4633A',
          500: '#A54B26',
          600: '#833A1B',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(90, 70, 30, 0.08), 0 1px 2px rgba(90, 70, 30, 0.04)',
        'warm-md': '0 4px 12px rgba(90, 70, 30, 0.1), 0 2px 6px rgba(90, 70, 30, 0.06)',
        'warm-lg': '0 8px 24px rgba(90, 70, 30, 0.12), 0 4px 12px rgba(90, 70, 30, 0.06)',
        'warm-xl': '0 16px 48px rgba(90, 70, 30, 0.14), 0 8px 24px rgba(90, 70, 30, 0.08)',
        'gold-glow': '0 0 20px rgba(201, 168, 76, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 10s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(20px) scale(0.95)' },
        },
      },
      backgroundImage: {
        'warmgold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #D4A843 50%, #E8C76A 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FAFAF7 0%, #F5F4EF 100%)',
        'hero-texture': 'radial-gradient(ellipse at 60% 0%, rgba(201,168,76,0.12) 0%, transparent 65%), radial-gradient(ellipse at 0% 100%, rgba(107,143,113,0.08) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
export default config
