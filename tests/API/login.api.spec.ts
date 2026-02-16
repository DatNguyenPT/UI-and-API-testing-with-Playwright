import { test, expect } from '../../fixtures/APIEndpoints.fixture';
import { logAPI } from '../../utils/logger';
import { StatusCode } from '../../api/StatusCode';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('API Login - DummyJSON', () => {

  test('@smoke @critical Login success', async ({ authAPI }) => {
    const credentials = { username: process.env.DUMMYJSON_USERNAME, password: process.env.DUMMYJSON_PASSWORD };

    await test.step('Login with valid credentials', async () => {
      const response = await authAPI.login(credentials);
      expect(response.status()).toBe(StatusCode.OK);
      const body = await response.json();
      logAPI('Response Body:', body);
      logAPI('Token:', body.accessToken);
      expect(body.accessToken).toBeDefined();
      expect(body.username).toBe(process.env.DUMMYJSON_USERNAME);
    });
  });

  test('@regression Login failed - invalid credentials', async ({ authAPI }) => {
    const credentials = { username: 'invaliduser', password: 'wrongpassword' };

    await test.step('Login with invalid credentials', async () => {
      const response = await authAPI.login(credentials);
      expect(response.status()).toBe(StatusCode.BAD_REQUEST);
      const body = await response.json();
      logAPI('Response Body:', body);
      expect(body.message).toBe('Invalid credentials');
    });
  });

  test('@regression Login failed - missing username', async ({ authAPI }) => {
    const credentials = { password: process.env.DUMMYJSON_PASSWORD };

    await test.step('Login with missing username', async () => {
      const response = await authAPI.login(credentials);
      expect(response.status()).toBe(StatusCode.BAD_REQUEST);
      const body = await response.json();
      logAPI('Response Body:', body);
    });
  });
});
