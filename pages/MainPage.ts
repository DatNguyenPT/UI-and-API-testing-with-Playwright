import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class MainPage extends BasePage {
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartLink: Locator
  readonly burgerMenuButton: Locator
  readonly title: Locator
  readonly activeOption: Locator
  readonly productSortContainer: Locator

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.title = page.locator('[data-test="title"]');
    this.activeOption = page.locator('[data-test="active-option"]');
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
  }

  async goto() {
    logUI(`Navigating to Product Page: ${this.page.url()}`);
    await super.goto('/inventory.html');
  }
}
