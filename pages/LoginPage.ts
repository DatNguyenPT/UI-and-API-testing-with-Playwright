import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginBtn = page.locator('[data-test="login-button"]');
  }

  async goto() {
    await super.goto('/');
  }

  async login(user: string, pass: string) {
    logUI(`Logging in with username: ${user}`);
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}
