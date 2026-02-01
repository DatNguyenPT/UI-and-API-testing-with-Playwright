import { BaseApi } from './BaseApi';
import { API_ENDPOINTS } from '../fixtures/APIEndpoints.fixture';

export class AuthApi extends BaseApi {
  async login(credentials: any, headers?: Record<string, string>) {
    return this.post(API_ENDPOINTS.LOGIN,
        credentials,
        headers = { 'Content-Type': 'application/json', ...headers }
    );
  }
}
