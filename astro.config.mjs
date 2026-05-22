// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://paperclip.ing',
  devToolbar: { enabled: false },
  server: {
    host: true,
    port: 4321,
    strictPort: true,
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-inter',
        weights: [400, 500],
        styles: ['normal'],
        fallbacks: ['sans-serif'],
      },
      {
        provider: fontProviders.google(),
        name: 'Inter Tight',
        cssVariable: '--font-inter-tight',
        weights: [500, 600, 700],
        styles: ['normal'],
        fallbacks: ['sans-serif'],
      },
      {
        provider: fontProviders.google(),
        name: 'JetBrains Mono',
        cssVariable: '--font-jetbrains-mono',
        weights: [400, 500],
        styles: ['normal'],
        fallbacks: ['monospace'],
      },
    ],
  },
});
