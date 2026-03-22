// Vitest Configuration
// tests/vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup.js'],
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'public/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js', 'node_modules/**'],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    },
    reporters: ['default', 'html'],
    outputFile: {
      html: 'tests/reports/html/index.html',
      json: 'tests/reports/json/results.json'
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@core': '/src/core',
      '@features': '/src/features',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@config': '/src/config'
    }
  }
});
