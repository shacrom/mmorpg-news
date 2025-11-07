// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://zonagamer.online',

  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: 4322
  },
  vite: {
    plugins: [tailwindcss()],
    preview: { allowedHosts: ['zonagamer.online', 'www.zonagamer.online'] },
  },
  integrations: [mdx(), sitemap()]
});