import {
  configDefaults,
  defineConfig
} from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    include: ['./test/**/*.test.js'],
    coverage: {
      include: ['src/**'],
      exclude: ['test/**'],
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    reporters: ['default', 'html'],
    globals: true
  }
});
