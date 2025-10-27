// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 4322
  },
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  }
});