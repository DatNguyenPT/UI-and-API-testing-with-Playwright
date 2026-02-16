import { BaseApi } from './BaseApi';
import { API_ENDPOINTS } from '../fixtures/APIEndpoints.fixture';

export interface Product {
  id?: number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
}

export class ProductsApi extends BaseApi {
  async getAllProducts(limit?: number, skip?: number) {
    const params: Record<string, string | number> = {};
    if (limit) params.limit = limit;
    if (skip) params.skip = skip;
    return this.get(API_ENDPOINTS.GETALLPRODUCTS, params);
  }

  async getProductById(id: number) {
    return this.get(API_ENDPOINTS.GETPRODUCTBYID(id));
  }

  async searchProducts(query: string) {
    return this.get('/products/search', { q: query });
  }

  async getProductsByCategory(category: string) {
    return this.get(`/products/category/${category}`);
  }

  async getAllCategories() {
    return this.get('/products/categories');
  }

  async addProduct(product: Product) {
    return this.post('/products/add', product, {
      'Content-Type': 'application/json',
    });
  }

  async updateProduct(id: number, product: Partial<Product>) {
    return this.put(`/products/${id}`, product, {
      'Content-Type': 'application/json',
    });
  }

  async deleteProduct(id: number) {
    return this.delete(`/products/${id}`);
  }
}
