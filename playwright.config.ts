import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '.env') });

const sauceDemoBaseURL = 'https://www.saucedemo.com';
const apiBaseURL = 'https://dummyjson.com';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,
  workers: 2,

  // Visual regression snapshot settings
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,           // Allow small pixel differences
      maxDiffPixelRatio: 0.01,      // 1% pixel difference threshold
      threshold: 0.2,               // Color threshold (0-1)
      animations: 'disabled',       // Disable animations for consistency
    },
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  // Snapshot output directory
  snapshotDir: './snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ["allure-playwright"]
  ],

  projects: [
    {
      name: 'ui-chromium',
      testDir: './tests/UI',
      use: {
        baseURL: sauceDemoBaseURL,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
        ...devices['Desktop Chrome'] 
      },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/UI',
      use: { 
        baseURL: sauceDemoBaseURL,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
        ...devices['Desktop Firefox'] 
      },
    },
    {
      name: 'ui-webkit',
      testDir: './tests/UI',
      use: { 
        baseURL: sauceDemoBaseURL,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
        ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testDir: './tests/API',
      use: {
        baseURL: apiBaseURL,
      },
    }
  ],
});
