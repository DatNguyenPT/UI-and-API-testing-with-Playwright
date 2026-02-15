import { test as base } from '@playwright/test';
import { ProductDetailPage } from '../pages/ProductDetail';
import * as dotenv from 'dotenv';
dotenv.config();

type ProductDetailPageFixtures = {
  productDetailPage: ProductDetailPage;
};

export const test = base.extend<ProductDetailPageFixtures>({
  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page);
    await use(productDetailPage);
  },
});

export { expect } from '@playwright/test';
