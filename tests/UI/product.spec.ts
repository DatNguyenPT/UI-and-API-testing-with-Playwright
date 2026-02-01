import { test, expect } from '../../fixtures/MainPage.fixture';
import { logUI } from '../../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Product Page - SauceDemo', () => {

  test('Verify components on product page', async ({ mainPage }) => {
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

});