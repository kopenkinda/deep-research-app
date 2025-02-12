import { defineWorkspace } from 'vitest/config';

const isHeadless =
  process.argv.includes('--browser.headless') || !!process.env.CI;

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    optimizeDeps: {
      include: ['react/jsx-dev-runtime'],
    },
    server: {
      fs: {
        strict: false,
      },
    },
    test: {
      includeTaskLocation: true,
      include: ['./test/browser/*.test.tsx'],
      name: 'browser tests',
      browser: {
        enabled: true,
        headless: isHeadless,
        name: 'chromium',
        provider: 'playwright',
        providerOptions: {},
      },
    },
  },
]);
