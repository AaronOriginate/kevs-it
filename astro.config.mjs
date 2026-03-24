// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isGitHub = !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  site: isGitHub ? 'https://aaronoriginate.github.io' : 'https://kevsit.co.uk',
  base: isGitHub ? '/kevs-it' : '/',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
    },
  },
});
