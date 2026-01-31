import { defineConfig, devices } from '@playwright/test';

const sauceDemoBaseURL = 'https://www.saucedemo.com';
const reqresBaseURL = 'https://reqres.in/api';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,
  workers: 2,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
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
      name: 'api-reqres',
      testDir: './tests/API',
      use: {
        baseURL: reqresBaseURL,
      },
    }
  ],
});
