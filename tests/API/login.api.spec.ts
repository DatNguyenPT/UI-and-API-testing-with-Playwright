import { test, expect } from '@playwright/test';
import { AuthApi } from '../../api/AuthApi';
import { logAPI } from '../../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('API Login - Mock', () => {

  test('Login success', async ({ request }) => {
    const authApi = new AuthApi(request);
    const credentials = { username: process.env.FAKESTOREAPI_USERNAME, password: process.env.FAKESTOREAPI_PASSWORD };
    const response = await authApi.login(credentials);

    test.skip(response.status() === 403, 'Skipping test due to mock API limitation - CORS limitation.');

    expect(response.status()).toBe(201);// mock API returns 201 for created

    let body;
    const contentType = response.headers()['content-type'];
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }
    logAPI('Response Body:', body);
    logAPI('Token:', body.token);
    expect(body.token).toBeDefined();
  });

  test('Login failed - missing password', async ({ request }) => {
    const authApi = new AuthApi(request);
    const credentials = { username: process.env.FAKESTOREAPI_USERNAME }; // No password provided
    const response = await authApi.login(credentials);

    test.skip(response.status() === 403, 'Skipping test due to mock API limitation - CORS limitation.');

    expect(response.status()).toBe(400);

    let body;
    const contentType = response.headers()['content-type'];
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }
    logAPI('Response Body:', body);
  });
});
