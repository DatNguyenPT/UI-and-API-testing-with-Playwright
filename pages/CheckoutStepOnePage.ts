import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class CheckoutStepOnePage extends BasePage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('[data-test="error-button"]');
  }

  async goto() {
    logUI('Navigating to Checkout Step One');
    await super.goto('/checkout-step-one.html');
  }

  async fillUserInfo(firstName: string, lastName: string, postalCode: string) {
    logUI(`Filling user info: ${firstName} ${lastName}, ${postalCode}`);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    logUI('Clicking Continue');
    await this.continueButton.click();
  }

  async cancel() {
    logUI('Clicking Cancel');
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    const text = await this.errorMessage.textContent();
    logUI(`Error message: ${text}`);
    return text;
  }

  async dismissError() {
    logUI('Dismissing error');
    await this.errorButton.click();
  }
}
