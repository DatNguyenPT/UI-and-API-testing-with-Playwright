import { test, expect } from "../../fixtures/MainPage.fixture";
import { logUI } from "../../utils/logger";
import { products } from "../../fixtures/Products";
import * as dotenv from "dotenv";
dotenv.config();

test.describe("Access To A Product Detail Page", () => {
  test("Access to product detail page", async ({ mainPage }) => {
    await test.step("Open product page", async () => {
      await mainPage.goto();
    });
    await test.step("View product details", async () => {
      const productName = products[1];
      logUI(`Randomly selected product: ${productName}`);
      await mainPage.viewProductDetailsByName(productName);
    });
    await test.step("Verify product detail page is displayed", async () => {
      const itemCount = await mainPage.inventoryItems.count();
      logUI("Number of products displayed:", itemCount);
      expect(itemCount).toBe(1);
      const displayedProductName = await mainPage.page.locator('[data-test="inventory-item-name"]').textContent();
      expect(displayedProductName?.trim()).toBe(products[1]);
    });
  });
  test("Direct access to product detail page", async ({ mainPage }) => {
    let productDetails: { name?: string | null; price?: string | null; description?: string | null };
    
    await test.step("Open product page", async () => {
      await mainPage.goto();
    });
    await test.step("Get product details", async () => {
      productDetails = await mainPage.getProductDetailsByName(products[1]);
      logUI(`Product details: ${JSON.stringify(productDetails)}`);
    });
    await test.step("Directly access product detail page", async () => {
      await mainPage.viewProductDetailsByName(productDetails.name!);
    });
    await test.step("Verify product details are correct", async () => {
      const displayedProductName = await mainPage.page.locator('[data-test="inventory-item-name"]').textContent();
      const displayedProductPrice = await mainPage.page.locator('[data-test="inventory-item-price"]').textContent();
      const displayedProductDescription = await mainPage.page.locator('[data-test="inventory-item-desc"]').textContent();
      expect(displayedProductName?.trim()).toBe(productDetails.name);
      expect(displayedProductPrice?.trim()).toBe(productDetails.price);
      expect(displayedProductDescription?.trim()).toBe(productDetails.description);
    });
  });
});
