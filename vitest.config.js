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
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 100,
        statements: 100,
        functions: 100,
        branches: 100,
        perFile: true
      }
    },
    reporters: ['default', 'html'],
    globals: true
  }
});
