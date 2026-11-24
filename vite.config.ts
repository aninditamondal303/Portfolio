import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// If you deploy to a project page (github.io/<repo>/), set base to '/<repo>/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
});
