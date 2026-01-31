import { test, expect } from '../../fixtures/login.fixture';
import * as dotenv from 'dotenv';
dotenv.config();

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

    //await expect(loginPage.page.locator('.error-message-container error')).toBeVisible();
    await expect(loginPage.page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    
    const errorButton = loginPage.page.locator('[data-test="error-button"]')
    await expect(errorButton).toBeVisible();
    await errorButton.click()
    await expect(loginPage.page.locator('[data-test="error"]')).toBeHidden()
    await expect(loginPage.page.locator('.error-message-container error')).toBeHidden()
  });

});