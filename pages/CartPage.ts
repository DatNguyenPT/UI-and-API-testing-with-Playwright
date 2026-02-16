import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartQuantityLabel: Locator;
  readonly cartDescriptionLabel: Locator;
  readonly cartItem: Locator;
  readonly cartList: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartQuantityLabel = page.locator('.cart_quantity_label');
    this.cartDescriptionLabel = page.locator('.cart_desc_label');
    this.cartItem = page.locator('[data-test="inventory-item"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async goto() {
    logUI('Navigating to Cart Page');
    await super.goto('/cart.html');
  }

  async getCartItemCount(): Promise<number> {
    const count = await this.cartItem.count();
    logUI(`Cart has ${count} items`);
    return count;
  }

  async getCartItemDetails(index: number = 0) {
    const item = this.cartItem.nth(index);
    const name = await item.locator('[data-test="inventory-item-name"]').textContent();
    const description = await item.locator('[data-test="inventory-item-desc"]').textContent();
    const price = await item.locator('[data-test="inventory-item-price"]').textContent();
    const quantity = await item.locator('[data-test="item-quantity"]').textContent();
    
    logUI(`Cart item ${index}: ${name} - ${price} x${quantity}`);
    return { name, description, price, quantity };
  }

  async removeItemByName(productName: string) {
    const item = this.cartItem.filter({ hasText: productName });
    const removeButton = item.locator('button[data-test^="remove"]');
    logUI(`Removing from cart: ${productName}`);
    await removeButton.click();
  }

  async continueShopping() {
    logUI('Clicking Continue Shopping');
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    logUI('Proceeding to Checkout');
    await this.checkoutButton.click();
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.cartItem.count();
    return count === 0;
  }
}
