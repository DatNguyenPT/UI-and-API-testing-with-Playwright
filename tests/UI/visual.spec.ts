import { test, expect } from '../../fixtures/Cart.fixture';
import * as dotenv from 'dotenv';
dotenv.config();

const username = process.env.SAUCEDEMO_USERNAME!;
const password = process.env.SAUCEDEMO_PASSWORD!;

test.describe('Visual Regression Tests', () => {
  
  test.describe('Unauthenticated Pages', () => {
    test('@visual Login page snapshot', async ({ page }) => {
      await page.goto('/');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('login-page.png', {
        fullPage: true,
      });
    });
  });

  test.describe('Authenticated Pages', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/');
      await page.fill('[data-test="username"]', username);
      await page.fill('[data-test="password"]', password);
      await page.click('[data-test="login-button"]');
      await page.waitForURL('**/inventory.html');
    });

    test('@visual Inventory page snapshot', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('inventory-page.png', {
        fullPage: true,
      });
    });

    test('@visual Inventory page - header only', async ({ page }) => {
      const header = page.locator('.header_container');
      
      await expect(header).toHaveScreenshot('inventory-header.png');
    });

    test('@visual Product card snapshot', async ({ page }) => {
      const firstProductCard = page.locator('.inventory_item').first();
      
      await expect(firstProductCard).toHaveScreenshot('product-card.png');
    });

    test('@visual Product detail page snapshot', async ({ page }) => {
      // Click first product
      await page.locator('.inventory_item_name').first().click();
      await page.waitForURL('**/inventory-item.html**');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('product-detail-page.png', {
        fullPage: true,
      });
    });

    test('@visual Cart page - empty', async ({ page }) => {
      await page.click('.shopping_cart_link');
      await page.waitForURL('**/cart.html');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('cart-page-empty.png', {
        fullPage: true,
      });
    });

    test('@visual Cart page - with item', async ({ page, mainPage, cartPage }) => {
      // Add item to cart
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      
      // Go to cart
      await page.click('.shopping_cart_link');
      await page.waitForURL('**/cart.html');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('cart-page-with-item.png', {
        fullPage: true,
      });
    });

    test('@visual Checkout step one page', async ({ page }) => {
      // Add item and go to checkout
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.click('.shopping_cart_link');
      await page.click('[data-test="checkout"]');
      await page.waitForURL('**/checkout-step-one.html');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('checkout-step-one.png', {
        fullPage: true,
      });
    });

    test('@visual Checkout step two page', async ({ page }) => {
      // Add item and complete checkout step one
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.click('.shopping_cart_link');
      await page.click('[data-test="checkout"]');
      
      // Fill checkout info
      await page.fill('[data-test="firstName"]', 'Test');
      await page.fill('[data-test="lastName"]', 'User');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      
      await page.waitForURL('**/checkout-step-two.html');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('checkout-step-two.png', {
        fullPage: true,
      });
    });

    test('@visual Checkout complete page', async ({ page }) => {
      // Complete full checkout flow
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.click('.shopping_cart_link');
      await page.click('[data-test="checkout"]');
      
      await page.fill('[data-test="firstName"]', 'Test');
      await page.fill('[data-test="lastName"]', 'User');
      await page.fill('[data-test="postalCode"]', '12345');
      await page.click('[data-test="continue"]');
      await page.click('[data-test="finish"]');
      
      await page.waitForURL('**/checkout-complete.html');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('checkout-complete.png', {
        fullPage: true,
      });
    });
  });

  test.describe('Error States', () => {
    test('@visual Login error message', async ({ page }) => {
      await page.goto('/');
      await page.fill('[data-test="username"]', 'invalid');
      await page.fill('[data-test="password"]', 'invalid');
      await page.click('[data-test="login-button"]');
      
      // Wait for error message
      await page.waitForSelector('[data-test="error"]');
      
      await expect(page).toHaveScreenshot('login-error.png', {
        fullPage: true,
      });
    });

    test('@visual Checkout error - missing fields', async ({ page }) => {
      // Login first
      await page.goto('/');
      await page.fill('[data-test="username"]', username);
      await page.fill('[data-test="password"]', password);
      await page.click('[data-test="login-button"]');
      
      // Add item and go to checkout
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.click('.shopping_cart_link');
      await page.click('[data-test="checkout"]');
      
      // Click continue without filling fields
      await page.click('[data-test="continue"]');
      
      // Wait for error
      await page.waitForSelector('[data-test="error"]');
      
      await expect(page).toHaveScreenshot('checkout-error.png', {
        fullPage: true,
      });
    });
  });
});
