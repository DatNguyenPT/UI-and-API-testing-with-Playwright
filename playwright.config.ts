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
