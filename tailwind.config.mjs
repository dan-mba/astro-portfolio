/** @type {import('tailwindcss').Config} */
import { addIconSelectors } from '@iconify/tailwind';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [
    addIconSelectors(['fa7-brands', 'ic']),
  ],
}
