// @ts-check
import { defineConfig } from 'astro/config';

// Static marketing site at the apex. No adapter, no SSR — this page calls no backend.
// A `/blog` can grow later under src/pages without touching this config.
export default defineConfig({
  site: 'https://just-train.fit',
  output: 'static',
  trailingSlash: 'ignore',
});
