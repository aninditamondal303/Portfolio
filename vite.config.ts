import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The live site is a GitHub Pages project page at /Portfolio/; the deploy
// workflow builds with --base=/Portfolio/. Locally the site runs at the root.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
});
