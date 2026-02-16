import { test, expect } from '../../fixtures/Cart.fixture';
import { products } from '../../fixtures/Products';
import { logUI } from '../../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

// Test data
const validUserInfo = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345'
};

test.describe('Checkout Step One - User Information', () => {
  test.beforeEach(async ({ mainPage, cartPage }) => {
    // Setup: Add product and navigate to checkout
    await mainPage.goto();
    await mainPage.addToCartByName(products[0]);
    await cartPage.goto();
    await cartPage.proceedToCheckout();
  });

  test('@smoke @critical Complete checkout with valid info', async ({ checkoutStepOne, checkoutStepTwo, checkoutComplete }) => {
    await test.step('Fill user information', async () => {
      await checkoutStepOne.fillUserInfo(
        validUserInfo.firstName,
        validUserInfo.lastName,
        validUserInfo.postalCode
      );
    });
    
    await test.step('Continue to overview', async () => {
      await checkoutStepOne.continue();
    });
    
    await test.step('Verify on checkout overview page', async () => {
      await expect(checkoutStepOne.page).toHaveURL(/checkout-step-two\.html/);
    });
    
    await test.step('Verify order items displayed', async () => {
      const itemCount = await checkoutStepTwo.getCartItemCount();
      expect(itemCount).toBe(1);
    });
    
    await test.step('Finish checkout', async () => {
      await checkoutStepTwo.finish();
    });
    
    await test.step('Verify order confirmation', async () => {
      await expect(checkoutComplete.page).toHaveURL(/checkout-complete\.html/);
      const header = await checkoutComplete.getConfirmationHeader();
      expect(header).toContain('Thank you for your order');
    });
  });

  test('@regression Checkout fails with missing first name', async ({ checkoutStepOne }) => {
    await test.step('Fill info without first name', async () => {
      await checkoutStepOne.fillUserInfo('', validUserInfo.lastName, validUserInfo.postalCode);
    });
    
    await test.step('Click continue', async () => {
      await checkoutStepOne.continue();
    });
    
    await test.step('Verify error message', async () => {
      await expect(checkoutStepOne.errorMessage).toBeVisible();
      const errorText = await checkoutStepOne.getErrorMessage();
      expect(errorText).toContain('First Name is required');
    });
  });

  test('@regression Checkout fails with missing last name', async ({ checkoutStepOne }) => {
    await test.step('Fill info without last name', async () => {
      await checkoutStepOne.fillUserInfo(validUserInfo.firstName, '', validUserInfo.postalCode);
    });
    
    await test.step('Click continue', async () => {
      await checkoutStepOne.continue();
    });
    
    await test.step('Verify error message', async () => {
      await expect(checkoutStepOne.errorMessage).toBeVisible();
      const errorText = await checkoutStepOne.getErrorMessage();
      expect(errorText).toContain('Last Name is required');
    });
  });

  test('@regression Checkout fails with missing postal code', async ({ checkoutStepOne }) => {
    await test.step('Fill info without postal code', async () => {
      await checkoutStepOne.fillUserInfo(validUserInfo.firstName, validUserInfo.lastName, '');
    });
    
    await test.step('Click continue', async () => {
      await checkoutStepOne.continue();
    });
    
    await test.step('Verify error message', async () => {
      await expect(checkoutStepOne.errorMessage).toBeVisible();
      const errorText = await checkoutStepOne.getErrorMessage();
      expect(errorText).toContain('Postal Code is required');
    });
  });

  test('@regression Cancel checkout returns to cart', async ({ checkoutStepOne }) => {
    await test.step('Click cancel', async () => {
      await checkoutStepOne.cancel();
    });
    
    await test.step('Verify navigation to cart', async () => {
      await expect(checkoutStepOne.page).toHaveURL(/cart\.html/);
    });
  });
});

test.describe('Checkout Step Two - Order Overview', () => {
  test.beforeEach(async ({ mainPage, cartPage, checkoutStepOne }) => {
    // Setup: Add product and navigate to checkout step two
    await mainPage.goto();
    await mainPage.addToCartByName(products[0]);
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillUserInfo(
      validUserInfo.firstName,
      validUserInfo.lastName,
      validUserInfo.postalCode
    );
    await checkoutStepOne.continue();
  });

  test('@smoke Verify order summary on overview page', async ({ checkoutStepTwo }) => {
    await test.step('Verify title', async () => {
      await expect(checkoutStepTwo.title).toHaveText('Checkout: Overview');
    });
    
    await test.step('Verify cart items displayed', async () => {
      const itemCount = await checkoutStepTwo.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });
    
    await test.step('Verify payment info displayed', async () => {
      await expect(checkoutStepTwo.paymentInfoValue).toBeVisible();
    });
    
    await test.step('Verify shipping info displayed', async () => {
      await expect(checkoutStepTwo.shippingInfoValue).toBeVisible();
    });
    
    await test.step('Verify subtotal displayed', async () => {
      await expect(checkoutStepTwo.subtotalLabel).toBeVisible();
    });
    
    await test.step('Verify finish button visible', async () => {
      await expect(checkoutStepTwo.finishButton).toBeVisible();
    });
  });

  test('@regression Verify item total and tax calculation', async ({ checkoutStepTwo }) => {
    await test.step('Get price values', async () => {
      const prices = await checkoutStepTwo.getPriceValues();
      logUI(`Prices: Subtotal=$${prices.subtotal}, Tax=$${prices.tax}, Total=$${prices.total}`);
      
      // Verify total = subtotal + tax (with small tolerance for rounding)
      const calculatedTotal = prices.subtotal + prices.tax;
      expect(Math.abs(prices.total - calculatedTotal)).toBeLessThan(0.02);
    });
  });

  test('@regression Cancel on overview returns to inventory', async ({ checkoutStepTwo }) => {
    await test.step('Click cancel', async () => {
      await checkoutStepTwo.cancel();
    });
    
    await test.step('Verify navigation to inventory', async () => {
      await expect(checkoutStepTwo.page).toHaveURL(/inventory\.html/);
    });
  });

  test('@smoke @critical Finish button completes order', async ({ checkoutStepTwo, checkoutComplete }) => {
    await test.step('Click finish', async () => {
      await checkoutStepTwo.finish();
    });
    
    await test.step('Verify on completion page', async () => {
      await expect(checkoutComplete.page).toHaveURL(/checkout-complete\.html/);
    });
  });
});

test.describe('Checkout Complete - Confirmation', () => {
  test.beforeEach(async ({ mainPage, cartPage, checkoutStepOne, checkoutStepTwo }) => {
    // Setup: Complete full checkout flow
    await mainPage.goto();
    await mainPage.addToCartByName(products[0]);
    await cartPage.goto();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.fillUserInfo(
      validUserInfo.firstName,
      validUserInfo.lastName,
      validUserInfo.postalCode
    );
    await checkoutStepOne.continue();
    await checkoutStepTwo.finish();
  });

  test('@smoke Order confirmation message displayed', async ({ checkoutComplete }) => {
    await test.step('Verify confirmation header', async () => {
      const header = await checkoutComplete.getConfirmationHeader();
      expect(header).toContain('Thank you for your order');
    });
    
    await test.step('Verify confirmation text', async () => {
      const text = await checkoutComplete.getConfirmationText();
      expect(text).toBeTruthy();
    });
    
    await test.step('Verify confirmation image visible', async () => {
      await expect(checkoutComplete.completeImage).toBeVisible();
    });
  });

  test('@regression Back Home navigates to inventory', async ({ checkoutComplete }) => {
    await test.step('Verify Back Home button visible', async () => {
      await expect(checkoutComplete.backHomeButton).toBeVisible();
    });
    
    await test.step('Click Back Home', async () => {
      await checkoutComplete.backToHome();
    });
    
    await test.step('Verify navigation to inventory', async () => {
      await expect(checkoutComplete.page).toHaveURL(/inventory\.html/);
    });
  });
});
