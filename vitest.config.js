import {
  configDefaults,
  defineConfig
  // eslint-disable-next-line n/no-unpublished-import -- This is exported.
} from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    include: ['./test/**/*.test.js'],
    coverage: {
      include: ['src/**'],
      exclude: ['test/**', 'src/**/*.d.ts'],
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    reporters: ['default', 'html'],
    globals: true
  }
});
