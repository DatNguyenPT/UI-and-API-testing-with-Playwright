import { Page, Locator } from '@playwright/test';
import { logUI } from '../utils/logger';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = '/') {
    logUI(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  async waitForElement(locator: Locator, timeout: number = 30000) {
    logUI(`Waiting for element with timeout ${timeout}ms`);
    await locator.waitFor({ timeout });
  }

  async takeScreenshot(name: string) {
    const screenshotPath = `./test-results/screenshots/${name}.png`;
    logUI(`Taking screenshot: ${screenshotPath}`);
    await this.page.screenshot({ path: screenshotPath });
  }
}
