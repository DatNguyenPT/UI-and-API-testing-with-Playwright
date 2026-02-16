import { test, expect } from '../../fixtures/APIEndpoints.fixture';
import { logAPI } from '../../utils/logger';
import { StatusCode } from '../../api/StatusCode';

test.describe('API Products - DummyJSON', () => {

  test.describe('GET Products', () => {
    test('@smoke @critical Get all products', async ({ productsAPI }) => {
      await test.step('Fetch all products', async () => {
        const response = await productsAPI.getAllProducts();
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Total products:', body.total);
        expect(body.products).toBeDefined();
        expect(body.products.length).toBeGreaterThan(0);
      });
    });

    test('@regression Get products with pagination', async ({ productsAPI }) => {
      await test.step('Fetch products with limit and skip', async () => {
        const response = await productsAPI.getAllProducts(10, 5);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Products fetched:', body.products.length);
        expect(body.products.length).toBe(10);
        expect(body.skip).toBe(5);
      });
    });

    test('@smoke Get product by ID', async ({ productsAPI }) => {
      await test.step('Fetch product with ID 1', async () => {
        const response = await productsAPI.getProductById(1);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Product:', body);
        expect(body.id).toBe(1);
        expect(body.title).toBeDefined();
        expect(body.price).toBeDefined();
      });
    });

    test('@regression Get product by invalid ID returns 404', async ({ productsAPI }) => {
      await test.step('Fetch product with non-existent ID', async () => {
        const response = await productsAPI.getProductById(99999);
        expect(response.status()).toBe(StatusCode.NOT_FOUND);
      });
    });

    test('@regression Search products', async ({ productsAPI }) => {
      await test.step('Search for products', async () => {
        const response = await productsAPI.searchProducts('phone');
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Search results:', body.products.length);
        expect(body.products).toBeDefined();
      });
    });

    test('@regression Get all categories', async ({ productsAPI }) => {
      await test.step('Fetch all product categories', async () => {
        const response = await productsAPI.getAllCategories();
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Categories:', body);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });
    });

    test('@regression Get products by category', async ({ productsAPI }) => {
      await test.step('Fetch products in smartphones category', async () => {
        const response = await productsAPI.getProductsByCategory('smartphones');
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Products in category:', body.products.length);
        expect(body.products).toBeDefined();
      });
    });
  });

  test.describe('POST Products', () => {
    test('@smoke @critical Add new product', async ({ productsAPI }) => {
      const newProduct = {
        title: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        brand: 'TestBrand',
        category: 'electronics',
      };

      await test.step('Create new product', async () => {
        const response = await productsAPI.addProduct(newProduct);
        expect(response.status()).toBe(StatusCode.CREATED);
        const body = await response.json();
        logAPI('Created product:', body);
        expect(body.id).toBeDefined();
        expect(body.title).toBe(newProduct.title);
        expect(body.price).toBe(newProduct.price);
      });
    });
  });

  test.describe('PUT Products', () => {
    test('@regression Update product', async ({ productsAPI }) => {
      const updateData = {
        title: 'Updated Product Title',
        price: 149.99,
      };

      await test.step('Update product with ID 1', async () => {
        const response = await productsAPI.updateProduct(1, updateData);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Updated product:', body);
        expect(body.title).toBe(updateData.title);
        expect(body.price).toBe(updateData.price);
      });
    });
  });

  test.describe('DELETE Products', () => {
    test('@regression Delete product', async ({ productsAPI }) => {
      await test.step('Delete product with ID 1', async () => {
        const response = await productsAPI.deleteProduct(1);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Deleted product:', body);
        expect(body.isDeleted).toBe(true);
      });
    });
  });
});
