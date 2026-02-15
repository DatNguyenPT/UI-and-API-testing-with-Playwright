import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class MainPage extends BasePage {
  readonly inventoryList: Locator;
  readonly productContainer: Locator;
  readonly shoppingCartLink: Locator
  readonly burgerMenuButton: Locator
  readonly title: Locator
  readonly activeOption: Locator
  readonly productSortContainer: Locator
  readonly shoppingCartBadge: Locator

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.productContainer = page.locator('[data-test="inventory-item"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.title = page.locator('[data-test="title"]');
    this.activeOption = page.locator('[data-test="active-option"]');
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async goto() {
    logUI(`Navigating to Product Page: ${this.page.url()}`);
    await super.goto('/inventory.html');
  }

  async viewProductDetailsByName(productName: string) {
    const productContainer = this.productContainer.filter({ hasText: productName });
    const productTitle = productContainer.locator('[data-test="inventory-item-name"]');
    logUI(`Viewing details for product: ${productName}`);
    await productTitle.filter({ hasText: productName }).click();
  }

  async getProductDetailsByName(productName: string) {
    const productContainer = this.productContainer.filter({ hasText: productName });
    const productTitle = productContainer.locator('[data-test="inventory-item-name"]');
    const price = productContainer.locator('[data-test="inventory-item-price"]');
    const description = productContainer.locator('[data-test="inventory-item-desc"]');
    logUI(`Getting details for product: ${productName}`);
    const details = {
      name: await productTitle.textContent(),
      price: await price.textContent(),
      description: await description.textContent(),
    };
    return details;
  }

  async addToCartByName(productName: string) {
    const productContainer = this.productContainer.filter({ hasText: productName });
    const addToCartButton = productContainer.locator('button[data-test^="add-to-cart"]');
    logUI(`Adding product to cart: ${productName}`);
    await addToCartButton.click();
  }

  async removeFromCartByName(productName: string) {
    const productContainer = this.productContainer.filter({ hasText: productName });
    const removeButton = productContainer.locator('button[data-test^="remove"]');
    logUI(`Removing product from cart: ${productName}`);
    await removeButton.click();
  }
}
