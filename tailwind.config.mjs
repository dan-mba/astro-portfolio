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
        'ebony-clay': {
          50:  '#f4f6fb',
          100: '#e8ecf6',
          200: '#ccd7eb',
          300: '#9fb6da',
          400: '#6c90c4',
          500: '#4971ae',
          600: '#375992',
          700: '#2e4876',
          800: '#293e63',
          900: '#273653',
          950: '#192236',
        },
        'big-stone': {
          50: '#f1f7fd',
          100: '#e0edf9',
          200: '#c9e0f4',
          300: '#a3cded',
          400: '#77b1e3',
          500: '#5795da',
          600: '#437bcd',
          700: '#3967bc',
          800: '#345699',
          900: '#2e497a',
          950: '#1c2841',
        },
      },
    },
  },
  plugins: [
    addIconSelectors(['fa6-brands', 'ic']),
  ],
}
