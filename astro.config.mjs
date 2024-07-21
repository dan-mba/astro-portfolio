import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    icon({
      include: {
        'fa6-brands': ['github', 'linkedin'],
        ic: ['outline-place']
      }
    })
  ]
});