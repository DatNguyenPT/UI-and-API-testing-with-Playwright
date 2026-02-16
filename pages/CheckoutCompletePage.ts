import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class CheckoutCompletePage extends BasePage {
  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly completeImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.completeImage = page.locator('[data-test="pony-express"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async goto() {
    logUI('Navigating to Checkout Complete');
    await super.goto('/checkout-complete.html');
  }

  async getConfirmationHeader(): Promise<string | null> {
    const text = await this.completeHeader.textContent();
    logUI(`Confirmation header: ${text}`);
    return text;
  }

  async getConfirmationText(): Promise<string | null> {
    const text = await this.completeText.textContent();
    logUI(`Confirmation text: ${text}`);
    return text;
  }

  async backToHome() {
    logUI('Clicking Back Home');
    await this.backHomeButton.click();
  }
}
