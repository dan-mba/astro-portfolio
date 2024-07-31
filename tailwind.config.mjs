/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

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
        	50: '#f6f6f6',
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
				secondary: {
        	50: '#e8f0ff',
        	100: '#d6e3ff',
        	200: '#b5ccff',
        	300: '#89a8ff',
        	400: '#5a76ff',
        	500: '#3545ff',
        	600: '#1312ff',
        	700: '#0b08fa',
        	800: '#0a0ac2',
        	900: '#13169c',
        	950: '#0b0b5b',
    		},
			},
		},
	},
	plugins: [],
}
