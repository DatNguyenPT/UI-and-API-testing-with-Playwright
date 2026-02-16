import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MainPage } from '../pages/MainPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import * as dotenv from 'dotenv';
dotenv.config();

type CartFixtures = {
  cartPage: CartPage;
  mainPage: MainPage;
  checkoutStepOne: CheckoutStepOnePage;
  checkoutStepTwo: CheckoutStepTwoPage;
  checkoutComplete: CheckoutCompletePage;
};

export const test = base.extend<CartFixtures>({
  mainPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCEDEMO_USERNAME!, process.env.SAUCEDEMO_PASSWORD!);
    
    const mainPage = new MainPage(page);
    await use(mainPage);
  },

  cartPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SAUCEDEMO_USERNAME!, process.env.SAUCEDEMO_PASSWORD!);
    
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutStepOne: async ({ page }, use) => {
    const checkoutStepOne = new CheckoutStepOnePage(page);
    await use(checkoutStepOne);
  },

  checkoutStepTwo: async ({ page }, use) => {
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    await use(checkoutStepTwo);
  },

  checkoutComplete: async ({ page }, use) => {
    const checkoutComplete = new CheckoutCompletePage(page);
    await use(checkoutComplete);
  },
});

export { expect } from '@playwright/test';
