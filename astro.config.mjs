import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
const pages = process.env.CI ? {
  site: 'https://dan-mba.github.io',
  base: 'astro-portfolio'
} : {
  site: 'http://localhost:4321'
};


// https://astro.build/config
export default defineConfig({
  ...pages,
  trailingSlash: 'always',
  image: {
    domains: ["repository-images.githubusercontent.com"]
  },
  integrations: [
    react(),
    tailwind(),
    icon({
      include: {
        'fa6-brands': ['github', 'linkedin'],
        ic: ['baseline-code', 'baseline-menu', 'baseline-link', 'round-star-outline', 'outline-place', 'twotone-web']
      }
    }),
    sitemap()
  ]
});