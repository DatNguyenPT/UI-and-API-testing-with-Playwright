import { test, expect } from '../../fixtures/APIEndpoints.fixture';
import { logAPI } from '../../utils/logger';
import { StatusCode } from '../../api/StatusCode';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('API Login - Mock', () => {

  test('Login success', async ({ authAPI }) => {
    const credentials = { username: process.env.FAKESTOREAPI_USERNAME, password: process.env.FAKESTOREAPI_PASSWORD };
    const response = await authAPI.login(credentials);

    test.skip(response.status() === StatusCode.FORBIDDEN, 'Skipping test due to mock API limitation - CORS limitation.');

    expect(response.status()).toBe(StatusCode.CREATED);// mock API returns 201 for created

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

  test('Login failed - missing password', async ({ authAPI }) => {
    const credentials = { username: process.env.FAKESTOREAPI_USERNAME }; // No password provided
    const response = await authAPI.login(credentials);

    test.skip(response.status() === StatusCode.FORBIDDEN, 'Skipping test due to mock API limitation - CORS limitation.');

    expect(response.status()).toBe(StatusCode.BAD_REQUEST);

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
