import { test as base } from '@playwright/test';
import { AuthApi } from '../api/AuthApi';

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

type authAPIFixtures = {
  authAPI: AuthApi;
};

export const test = base.extend<authAPIFixtures>({
  authAPI: async ({ request }, use) => {
    const authAPI = new AuthApi(request);
    await use(authAPI);
  }
});

export { expect } from '@playwright/test';