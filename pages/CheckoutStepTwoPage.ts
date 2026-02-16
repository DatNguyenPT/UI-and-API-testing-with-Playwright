import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class CheckoutStepTwoPage extends BasePage {
  readonly title: Locator;
  readonly cartItem: Locator;
  readonly cartList: Locator;
  readonly paymentInfoLabel: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoLabel: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItem = page.locator('[data-test="inventory-item"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async goto() {
    logUI('Navigating to Checkout Step Two');
    await super.goto('/checkout-step-two.html');
  }

  async getCartItemCount(): Promise<number> {
    const count = await this.cartItem.count();
    logUI(`Checkout has ${count} items`);
    return count;
  }

  async getSubtotal(): Promise<string | null> {
    const text = await this.subtotalLabel.textContent();
    logUI(`Subtotal: ${text}`);
    return text;
  }

  async getTax(): Promise<string | null> {
    const text = await this.taxLabel.textContent();
    logUI(`Tax: ${text}`);
    return text;
  }

  async getTotal(): Promise<string | null> {
    const text = await this.totalLabel.textContent();
    logUI(`Total: ${text}`);
    return text;
  }

  async getPriceValues() {
    const subtotalText = await this.subtotalLabel.textContent() || '';
    const taxText = await this.taxLabel.textContent() || '';
    const totalText = await this.totalLabel.textContent() || '';

    // Extract numeric values from text like "Item total: $29.99"
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, '')) || 0;
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, '')) || 0;
    const total = parseFloat(totalText.replace(/[^0-9.]/g, '')) || 0;

    logUI(`Prices - Subtotal: $${subtotal}, Tax: $${tax}, Total: $${total}`);
    return { subtotal, tax, total };
  }

  async finish() {
    logUI('Clicking Finish');
    await this.finishButton.click();
  }

  async cancel() {
    logUI('Clicking Cancel');
    await this.cancelButton.click();
  }
}
