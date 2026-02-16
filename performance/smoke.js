import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke Test Configuration
// Quick validation that the API is working correctly
// Low VU count and short duration for fast feedback

export const options = {
  vus: 1,                    // 1 virtual user
  duration: '30s',           // 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests under 2s
    http_req_failed: ['rate<0.01'],      // Less than 1% failure rate
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'https://dummyjson.com';

export default function () {
  // Test 1: Get all products
  let productsRes = http.get(`${BASE_URL}/products?limit=10`);
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'products has data': (r) => JSON.parse(r.body).products.length > 0,
  });
  sleep(1);

  // Test 2: Get single product
  let productRes = http.get(`${BASE_URL}/products/1`);
  check(productRes, {
    'product status is 200': (r) => r.status === 200,
    'product has id': (r) => JSON.parse(r.body).id === 1,
  });
  sleep(1);

  // Test 3: Get all users
  let usersRes = http.get(`${BASE_URL}/users?limit=10`);
  check(usersRes, {
    'users status is 200': (r) => r.status === 200,
    'users has data': (r) => JSON.parse(r.body).users.length > 0,
  });
  sleep(1);

  // Test 4: Search products
  let searchRes = http.get(`${BASE_URL}/products/search?q=phone`);
  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // Test 5: Get categories
  let categoriesRes = http.get(`${BASE_URL}/products/categories`);
  check(categoriesRes, {
    'categories status is 200': (r) => r.status === 200,
    'categories is array': (r) => Array.isArray(JSON.parse(r.body)),
  });
  sleep(1);
}

export function handleSummary(data) {
  console.log('\n=== Smoke Test Summary ===');
  console.log(`Total Requests: ${data.metrics.http_reqs.values.count}`);
  console.log(`Failed Requests: ${data.metrics.http_req_failed.values.passes}`);
  console.log(`Avg Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
  console.log(`95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
  return {};
}
