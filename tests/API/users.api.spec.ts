import { test, expect } from '../../fixtures/APIEndpoints.fixture';
import { logAPI } from '../../utils/logger';
import { StatusCode } from '../../api/StatusCode';

test.describe('API Users - DummyJSON', () => {

  test.describe('GET Users', () => {
    test('@smoke @critical Get all users', async ({ usersAPI }) => {
      await test.step('Fetch all users', async () => {
        const response = await usersAPI.getAllUsers();
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Total users:', body.total);
        expect(body.users).toBeDefined();
        expect(body.users.length).toBeGreaterThan(0);
      });
    });

    test('@regression Get users with pagination', async ({ usersAPI }) => {
      await test.step('Fetch users with limit and skip', async () => {
        const response = await usersAPI.getAllUsers(5, 10);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Users fetched:', body.users.length);
        expect(body.users.length).toBe(5);
        expect(body.skip).toBe(10);
      });
    });

    test('@smoke Get user by ID', async ({ usersAPI }) => {
      await test.step('Fetch user with ID 1', async () => {
        const response = await usersAPI.getUserById(1);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('User:', body);
        expect(body.id).toBe(1);
        expect(body.firstName).toBeDefined();
        expect(body.lastName).toBeDefined();
      });
    });

    test('@regression Get user by invalid ID returns 404', async ({ usersAPI }) => {
      await test.step('Fetch user with non-existent ID', async () => {
        const response = await usersAPI.getUserById(99999);
        expect(response.status()).toBe(StatusCode.NOT_FOUND);
      });
    });

    test('@regression Search users', async ({ usersAPI }) => {
      await test.step('Search for users by name', async () => {
        const response = await usersAPI.searchUsers('John');
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Search results:', body.users.length);
        expect(body.users).toBeDefined();
      });
    });
  });

  test.describe('POST Users', () => {
    test('@smoke @critical Add new user', async ({ usersAPI }) => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        email: 'test.user@example.com',
      };

      await test.step('Create new user', async () => {
        const response = await usersAPI.addUser(newUser);
        expect(response.status()).toBe(StatusCode.CREATED);
        const body = await response.json();
        logAPI('Created user:', body);
        expect(body.id).toBeDefined();
        expect(body.firstName).toBe(newUser.firstName);
        expect(body.lastName).toBe(newUser.lastName);
      });
    });
  });

  test.describe('PUT Users', () => {
    test('@regression Update user', async ({ usersAPI }) => {
      const updateData = {
        firstName: 'UpdatedName',
      };

      await test.step('Update user with ID 1', async () => {
        const response = await usersAPI.updateUser(1, updateData);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Updated user:', body);
        expect(body.firstName).toBe(updateData.firstName);
      });
    });
  });

  test.describe('DELETE Users', () => {
    test('@regression Delete user', async ({ usersAPI }) => {
      await test.step('Delete user with ID 1', async () => {
        const response = await usersAPI.deleteUser(1);
        expect(response.status()).toBe(StatusCode.OK);
        const body = await response.json();
        logAPI('Deleted user:', body);
        expect(body.isDeleted).toBe(true);
      });
    });
  });
});
