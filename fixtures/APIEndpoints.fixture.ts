import { test as base } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';
import { UsersApi } from '../api/UsersApi';
import { ProductsApi } from '../api/ProductsApi';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  GETALLUSERS: '/users',
  GETUSERBYID: (id: number) => `/users/${id}`,
  ADDNEWUSER: '/users/add',
  UPDATEAUSER: (id: number) => `/users/${id}`,
  DELETEAUSER: (id: number) => `/users/${id}`,
  GETALLPRODUCTS: '/products',
  GETPRODUCTBYID: (id: number) => `/products/${id}`,
};

type APIFixtures = {
  authAPI: AuthApi;
  usersAPI: UsersApi;
  productsAPI: ProductsApi;
};

export const test = base.extend<APIFixtures>({
  authAPI: async ({ request }, use) => {
    const authAPI = new AuthApi(request);
    await use(authAPI);
  },
  usersAPI: async ({ request }, use) => {
    const usersAPI = new UsersApi(request);
    await use(usersAPI);
  },
  productsAPI: async ({ request }, use) => {
    const productsAPI = new ProductsApi(request);
    await use(productsAPI);
  },
});

export { expect } from '@playwright/test';