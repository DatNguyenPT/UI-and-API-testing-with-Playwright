import { test, expect } from '../../fixtures/MainPage.fixture';
import { logUI } from '../../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Product Page - SauceDemo', () => {

  test('Verify components on product page', async ({ mainPage }) => {
    await mainPage.goto();
    const itemCount = await mainPage.inventoryItems.count();
    logUI('Number of products displayed:', itemCount);
    expect(itemCount).toBeGreaterThan(0);
    expect(await mainPage.title.textContent()).toBe('Products');
    expect(await mainPage.shoppingCartLink.isVisible()).toBeTruthy();
    expect(await mainPage.burgerMenuButton.isVisible()).toBeTruthy();
    expect(await mainPage.activeOption.textContent()).toBe('Name (A to Z)');
    await mainPage.productSortContainer.click();
    const options = mainPage.page.locator('option');
    await expect(options).toHaveCount(4);
    await expect(options).toHaveText([
        'Name (A to Z)',
        'Name (Z to A)',
        'Price (low to high)',
        'Price (high to low)',
    ]);
  });


  test('Sort by Name (A to Z)', async ({ mainPage }) => {
    await test.step('Open product page', async () => {
      await mainPage.goto();
    });

    await test.step('Select sort option Name (A to Z)', async () => {
      await mainPage.productSortContainer.selectOption({ label: 'Name (A to Z)' });
    });

    await test.step('Verify product names are sorted A to Z', async () => {
      const productNames = await mainPage.page.$$eval(
        '[data-test="inventory-item-name"]',
        els => els.map(e => e.textContent?.trim() || '')
      );
      expect(productNames.length).toBeGreaterThan(1);
      const emptyNames = productNames.filter(name => name === '');
      expect(emptyNames, 'All product names should be non-empty').toHaveLength(0);
      const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
      expect(productNames).toEqual(sortedNames);
    });
  });


  test('Sort by Name (Z to A)', async ({ mainPage }) => {
    await test.step('Open product page', async () => {
      await mainPage.goto();
    });

    await test.step('Select sort option Name (Z to A)', async () => {
      await mainPage.productSortContainer.selectOption({ label: 'Name (Z to A)' });
    });

    await test.step('Verify product names are sorted Z to A', async () => {
      const productNames = await mainPage.page.$$eval(
        '[data-test="inventory-item-name"]',
        els => els.map(e => e.textContent?.trim() || '')
      );
      expect(productNames.length).toBeGreaterThan(1);
      const emptyNames = productNames.filter(name => name === '');
      expect(emptyNames, 'All product names should be non-empty').toHaveLength(0);
      const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
      expect(productNames).toEqual(sortedNames);
    });
  });


  test('Sort by Price (low to high)', async ({ mainPage }) => {
    await test.step('Open product page', async () => {
      await mainPage.goto();
    });

    await test.step('Select sort option Price (low to high)', async () => {
      await mainPage.productSortContainer.selectOption({ label: 'Price (low to high)' });
    });

    await test.step('Verify product prices are sorted low to high', async () => {
      const productPrices = await mainPage.page.$$eval(
        '[data-test="inventory-item-price"]',
        els => els.map(e => e.textContent?.trim() || '')
      );
      expect(productPrices.length).toBeGreaterThan(1);
      const emptyPrices = productPrices.filter(price => price === '');
      expect(emptyPrices, 'All product prices should be non-empty').toHaveLength(0);
      const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
      const sortedPrices = [...numericPrices].sort((a, b) => a - b);
      expect(numericPrices).toEqual(sortedPrices);
    });
  });


  test('Sort by Price (high to low)', async ({ mainPage }) => {
    await test.step('Open product page', async () => {
      await mainPage.goto();
    });

    await test.step('Select sort option Price (high to low)', async () => {
      await mainPage.productSortContainer.selectOption({ label: 'Price (high to low)' });
    });

    await test.step('Verify product prices are sorted high to low', async () => {
      const productPrices = await mainPage.page.$$eval(
        '[data-test="inventory-item-price"]',
        els => els.map(e => e.textContent?.trim() || '')
      );
      expect(productPrices.length).toBeGreaterThan(1);
      const emptyPrices = productPrices.filter(price => price === '');
      expect(emptyPrices, 'All product prices should be non-empty').toHaveLength(0);
      const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
      const sortedPrices = [...numericPrices].sort((a, b) => b - a);
      expect(numericPrices).toEqual(sortedPrices);
    });
  });
});