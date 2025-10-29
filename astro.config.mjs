import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://ruuley.com',
  output: 'static',
  server: { port: 4321 },
  integrations: [],
});
