import { BaseApi } from './BaseApi';
import { API_ENDPOINTS } from '../fixtures/APIEndpoints.fixture';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  age?: number;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
}

export class UsersApi extends BaseApi {
  async getAllUsers(limit?: number, skip?: number) {
    const params: Record<string, string | number> = {};
    if (limit) params.limit = limit;
    if (skip) params.skip = skip;
    return this.get(API_ENDPOINTS.GETALLUSERS, params);
  }

  async getUserById(id: number) {
    return this.get(API_ENDPOINTS.GETUSERBYID(id));
  }

  async addUser(user: User) {
    return this.post(API_ENDPOINTS.ADDNEWUSER, user, {
      'Content-Type': 'application/json',
    });
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.put(API_ENDPOINTS.UPDATEAUSER(id), user, {
      'Content-Type': 'application/json',
    });
  }

  async deleteUser(id: number) {
    return this.delete(API_ENDPOINTS.DELETEAUSER(id));
  }

  async searchUsers(query: string) {
    return this.get('/users/search', { q: query });
  }
}
