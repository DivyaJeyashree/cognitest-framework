import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/api',
  timeout: 120000,
  retries: 2,
  use: {
    baseURL: process.env.BASE_URL || 'https://canvas-uat.muzaini.com',
    ignoreHTTPSErrors: true,
    actionTimeout: 60000,
    navigationTimeout: 60000
  }
});