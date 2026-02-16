import { test, expect } from '../../fixtures/Cart.fixture';
import { products } from '../../fixtures/Products';
import { logUI } from '../../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Cart Page - Empty State', () => {
  test('@smoke Empty cart displays correct UI elements', async ({ cartPage }) => {
    await test.step('Navigate to cart page', async () => {
      await cartPage.goto();
    });
    
    await test.step('Verify cart title', async () => {
      await expect(cartPage.title).toHaveText('Your Cart');
    });
    
    await test.step('Verify cart is empty', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(true);
    });
    
    await test.step('Verify Continue Shopping button is visible', async () => {
      await expect(cartPage.continueShoppingButton).toBeVisible();
    });
    
    await test.step('Verify Checkout button is visible', async () => {
      await expect(cartPage.checkoutButton).toBeVisible();
    });
  });
});

test.describe('Cart Page - With Products', () => {
  test('@smoke @critical Cart with single product shows correct details', async ({ mainPage, cartPage }) => {
    const productName = products[0]; // Sauce Labs Backpack
    
    await test.step('Navigate to inventory page', async () => {
      await mainPage.goto();
    });
    
    await test.step('Add product to cart', async () => {
      await mainPage.addToCartByName(productName);
      logUI(`Added product: ${productName}`);
    });
    
    await test.step('Navigate to cart', async () => {
      await cartPage.goto();
    });
    
    await test.step('Verify cart has one item', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });
    
    await test.step('Verify product details in cart', async () => {
      const itemDetails = await cartPage.getCartItemDetails(0);
      expect(itemDetails.name?.trim()).toBe(productName);
      expect(itemDetails.price).toBeTruthy();
      expect(itemDetails.quantity).toBe('1');
    });
  });

  test('@regression Cart with multiple products shows all items', async ({ mainPage, cartPage }) => {
    const product1 = products[0]; // Sauce Labs Backpack
    const product2 = products[1]; // Sauce Labs Bike Light
    const product3 = products[2]; // Sauce Labs Bolt T-Shirt
    
    await test.step('Navigate to inventory page', async () => {
      await mainPage.goto();
    });
    
    await test.step('Add multiple products to cart', async () => {
      await mainPage.addToCartByName(product1);
      await mainPage.addToCartByName(product2);
      await mainPage.addToCartByName(product3);
    });
    
    await test.step('Navigate to cart', async () => {
      await cartPage.goto();
    });
    
    await test.step('Verify cart has three items', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(3);
    });
    
    await test.step('Verify cart badge shows 3', async () => {
      await expect(cartPage.shoppingCartBadge).toHaveText('3');
    });
  });

  test('@smoke @critical Remove item from cart updates UI', async ({ mainPage, cartPage }) => {
    const productName = products[0];
    
    await test.step('Navigate to inventory and add product', async () => {
      await mainPage.goto();
      await mainPage.addToCartByName(productName);
    });
    
    await test.step('Navigate to cart', async () => {
      await cartPage.goto();
    });
    
    await test.step('Verify cart has one item', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });
    
    await test.step('Remove item from cart', async () => {
      await cartPage.removeItemByName(productName);
    });
    
    await test.step('Verify cart is now empty', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(true);
    });
    
    await test.step('Verify cart badge is not visible', async () => {
      await expect(cartPage.shoppingCartBadge).not.toBeVisible();
    });
  });
});

test.describe('Cart Page - Navigation', () => {
  test('@regression Continue Shopping navigates back to inventory', async ({ mainPage, cartPage }) => {
    await test.step('Navigate to inventory page', async () => {
      await mainPage.goto();
    });
    
    await test.step('Navigate to cart', async () => {
      await cartPage.goto();
    });
    
    await test.step('Click Continue Shopping', async () => {
      await cartPage.continueShopping();
    });
    
    await test.step('Verify navigation to inventory', async () => {
      await expect(cartPage.page).toHaveURL(/inventory\.html/);
    });
  });

  test('@smoke Checkout button leads to checkout page', async ({ mainPage, cartPage }) => {
    const productName = products[0];
    
    await test.step('Navigate to inventory and add product', async () => {
      await mainPage.goto();
      await mainPage.addToCartByName(productName);
    });
    
    await test.step('Navigate to cart', async () => {
      await cartPage.goto();
    });
    
    await test.step('Click Checkout', async () => {
      await cartPage.proceedToCheckout();
    });
    
    await test.step('Verify navigation to checkout', async () => {
      await expect(cartPage.page).toHaveURL(/checkout-step-one\.html/);
    });
  });
});
