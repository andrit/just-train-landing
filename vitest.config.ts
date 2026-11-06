import { defineConfig } from 'vitest/config';

// The functional core (src/lib, src/config) is plain TypeScript, unit-tested without
// standing up Astro. Component rendering is verified by `astro build` in `verify`.
export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
