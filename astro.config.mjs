import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

const pages = process.env.CI ? 
  {
    site: 'https://dan-mba.github.io',
    base: 'astro-portfolio',
  } : {};

// https://astro.build/config
export default defineConfig({
  ...pages,
  trailingSlash: 'always',
  image: {
    domains: ["repository-images.githubusercontent.com"],
  },
  integrations: [
    react(),
    tailwind(),
    icon({
      include: {
        'fa6-brands': ['github', 'linkedin'],
        ic: ['outline-place','baseline-code', 'twotone-web']
      }
    })
  ]
});