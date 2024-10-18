/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import { addIconSelectors } from '@iconify/tailwind';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      xs: '100px',
      sm: '350px',
      md: '500px',
      lg: '800px',
      xl: '1200px',
    },
    extend: {
      fontFamily: {
        hw: ['Damion', 'cursive'],
        sans: [
          '"Roboto Flex"',
          ...defaultTheme.fontFamily.sans,
        ]
      },
      colors: {
        primary: {
          50:  '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6f6f6f',
          600: '#5c5c5c',
          700: '#4a4a4a',
          800: '#383838',
          900: '#242424',
          950: '#121212',
        },
        'blue-ribbon': {
          50:  '#eff3ff',
          100: '#dce5fd',
          200: '#c1d1fc',
          300: '#96b5fa',
          400: '#648df6',
          500: '#3860f0',
          600: '#2b47e5',
          700: '#2234d3',
          800: '#222cab',
          900: '#212a87',
          950: '#191d52',
        },
      },
    },
  },
  plugins: [
    addIconSelectors(['fa6-brands', 'ic']),
  ],
}
