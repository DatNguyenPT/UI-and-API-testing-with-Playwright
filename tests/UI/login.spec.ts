import { test, expect } from '../../fixtures/login.fixture';
import * as dotenv from 'dotenv';
dotenv.config();

async function errorExpectation(loginPage: any, missingCredentialMessage: string) {
    const errorButton = loginPage.page.locator('[data-test="error-button"]')
    await expect(loginPage.page.locator('[data-test="error"]')).toHaveText(`Epic sadface: ${missingCredentialMessage}`);
    await expect(errorButton).toBeVisible();
    await errorButton.click()
    await expect(loginPage.page.locator('[data-test="error"]')).toBeHidden()
    await expect(loginPage.page.locator('.error-message-container error')).toBeHidden()
}

test.describe('Login - SauceDemo', () => {

  test('Login successfully with valid credentials', async ({ loginPage }) => {
    const username:string = process.env.SAUCEDEMO_USERNAME!;
    const password:string = process.env.SAUCEDEMO_PASSWORD!;
    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });
    await test.step('Login with valid credentials', async () => {
      await loginPage.login(username, password);
    });
    await test.step('Verify inventory page URL', async () => {
      await expect(loginPage.page).toHaveURL(/inventory.html/);
    });
    await test.step('Open burger menu', async () => {
      await loginPage.page.locator('#react-burger-menu-btn').click();
    });
    await test.step('Verify logout button is visible', async () => {
      const logoutBtn = loginPage.page.locator('#logout_sidebar_link');
      await expect(logoutBtn).toBeVisible();
    });
  });
});

// Parallel fail login tests
test.describe.parallel('Login with invalid credentials', () => {

  test('Login fails with invalid credentials', async ({ loginPage }) => {
    const invalidUsername:string = process.env.SAUCEDEMO_INVALID_USERNAME!;
    const invalidPassword:string = process.env.SAUCEDEMO_INVALID_PASSWORD!;
    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });
    await test.step('Login with invalid credentials', async () => {
      await loginPage.login(invalidUsername, invalidPassword);
    });
    await test.step('Verify error message', async () => {
      await errorExpectation(loginPage, 'Username and password do not match any user in this service');
    });
  });

  test('Login with empty username and password', async ({ loginPage }) => {
    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });
    await test.step('Login with empty username and password', async () => {
      await loginPage.login('', '');
    });
    await test.step('Verify error message', async () => {
      await errorExpectation(loginPage, 'Username is required');
    });
  });

  test('Login with empty username only', async ({ loginPage }) => {
    const password:string = process.env.SAUCEDEMO_PASSWORD!;
    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });
    await test.step('Login with empty username', async () => {
      await loginPage.login('', password);
    });
    await test.step('Verify error message', async () => {
      await errorExpectation(loginPage, 'Username is required');
    });
  });
  
  test('Login with empty password only', async ({ loginPage }) => {
    const username:string = process.env.SAUCEDEMO_USERNAME!;
    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });
    await test.step('Login with empty password', async () => {
      await loginPage.login(username, '');
    });
    await test.step('Verify error message', async () => {
      await errorExpectation(loginPage, 'Password is required');
    });
  });
});