import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
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
    sitemap()
  ]
});