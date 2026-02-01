import { test as base } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';
dotenv.config();

type MainPageFixtures = {
  mainPage: MainPage;
};

export const test = base.extend<MainPageFixtures>({
  mainPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCEDEMO_USERNAME!, process.env.SAUCEDEMO_PASSWORD!);
    
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});

export { expect } from '@playwright/test';
