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
    await loginPage.goto();
    await loginPage.login(username, password);
    await expect(loginPage.page).toHaveURL(/inventory.html/);
    // Click on burger menu and verify logout option is visible
    await loginPage.page.locator('#react-burger-menu-btn').click();
    const logoutBtn = loginPage.page.locator('#logout_sidebar_link');
    await expect(logoutBtn).toBeVisible();
  });

  test('Login fails with invalid credentials', async ({ loginPage }) => {
    const invalidUsername:string = process.env.SAUCEDEMO_INVALID_USERNAME!;
    const invalidPassword:string = process.env.SAUCEDEMO_INVALID_PASSWORD!;
    await loginPage.goto();
    await loginPage.login(invalidUsername, invalidPassword);
    await errorExpectation(loginPage, 'Username and password do not match any user in this service');
   
  });
});

// Parallel login tests
test.describe.parallel('Login with empty credentials', () => {
  test('Login with empty username and password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await errorExpectation(loginPage, 'Username is required');
  });

  test('Login with empty username only', async ({ loginPage }) => {
    const password:string = process.env.SAUCEDEMO_PASSWORD!;
    await loginPage.goto();
    await loginPage.login('', password);
    await errorExpectation(loginPage, 'Username is required');
  });
  
  test('Login with empty password only', async ({ loginPage }) => {
    const username:string = process.env.SAUCEDEMO_USERNAME!;
    await loginPage.goto();
    await loginPage.login(username, '');
    await errorExpectation(loginPage, 'Password is required');
  });
})