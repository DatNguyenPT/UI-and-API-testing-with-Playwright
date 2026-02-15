import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logUI } from '../utils/logger';

export class ProductDetailPage extends BasePage {
    readonly productContainer: Locator;
    readonly shoppingCartLink: Locator
    readonly burgerMenuButton: Locator
    readonly addToCartButton: Locator
    readonly removeFromCartButton: Locator
    readonly backToProductsButton: Locator
    readonly shoppingCartBadge: Locator

    constructor(page: Page) {
        super(page);
        this.productContainer = page.locator('[data-test="inventory-item"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.addToCartButton = page.locator('[data-test="add-to-cart"]');
        this.removeFromCartButton = page.locator('[data-test="remove"]');
        this.backToProductsButton = page.locator('[data-test="back-to-products"]');
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    async addToCart() {
        logUI("Adding product to cart from product detail page");
        await this.addToCartButton.click();
    }

    async removeFromCart() {
        logUI("Removing product from cart from product detail page");
        await this.removeFromCartButton.click();
    }

    async backToProducts() {
        logUI("Navigating back to products from product detail page");
        await this.backToProductsButton.click();
    }
}