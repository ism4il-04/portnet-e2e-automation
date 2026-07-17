import 'dotenv/config';
import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    browserName: 'chromium',
    headless: true,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium'
    }
  ]
});