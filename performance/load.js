import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Load Test Configuration
// Simulates typical production load with gradual ramp-up

const errorRate = new Rate('errors');
const productTrend = new Trend('product_request_duration');
const userTrend = new Trend('user_request_duration');

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users over 1 minute
    { duration: '3m', target: 10 },   // Stay at 10 users for 3 minutes
    { duration: '2m', target: 20 },   // Ramp up to 20 users over 2 minutes
    { duration: '3m', target: 20 },   // Stay at 20 users for 3 minutes
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    http_req_failed: ['rate<0.05'],
    errors: ['rate<0.05'],
    product_request_duration: ['p(95)<2500'],
    user_request_duration: ['p(95)<2500'],
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'https://dummyjson.com';

export default function () {
  group('Products API', () => {
    // Get products list
    let listRes = http.get(`${BASE_URL}/products?limit=20&skip=${Math.floor(Math.random() * 80)}`);
    productTrend.add(listRes.timings.duration);
    
    let listCheck = check(listRes, {
      'list products status 200': (r) => r.status === 200,
      'list products has items': (r) => {
        try {
          return JSON.parse(r.body).products.length > 0;
        } catch (e) {
          return false;
        }
      },
    });
    errorRate.add(!listCheck);
    sleep(0.5);

    // Get single product (random ID between 1-100)
    let productId = Math.floor(Math.random() * 100) + 1;
    let productRes = http.get(`${BASE_URL}/products/${productId}`);
    productTrend.add(productRes.timings.duration);
    
    let productCheck = check(productRes, {
      'get product status 200': (r) => r.status === 200,
    });
    errorRate.add(!productCheck);
    sleep(0.5);

    // Search products
    const searchTerms = ['phone', 'laptop', 'watch', 'camera', 'tablet'];
    let searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    let searchRes = http.get(`${BASE_URL}/products/search?q=${searchTerm}`);
    productTrend.add(searchRes.timings.duration);
    
    let searchCheck = check(searchRes, {
      'search status 200': (r) => r.status === 200,
    });
    errorRate.add(!searchCheck);
    sleep(0.5);
  });

  group('Users API', () => {
    // Get users list
    let usersRes = http.get(`${BASE_URL}/users?limit=10`);
    userTrend.add(usersRes.timings.duration);
    
    let usersCheck = check(usersRes, {
      'list users status 200': (r) => r.status === 200,
    });
    errorRate.add(!usersCheck);
    sleep(0.5);

    // Get single user
    let userId = Math.floor(Math.random() * 100) + 1;
    let userRes = http.get(`${BASE_URL}/users/${userId}`);
    userTrend.add(userRes.timings.duration);
    
    let userCheck = check(userRes, {
      'get user status 200': (r) => r.status === 200,
    });
    errorRate.add(!userCheck);
    sleep(0.5);
  });

  group('Categories API', () => {
    let categoriesRes = http.get(`${BASE_URL}/products/categories`);
    
    let categoriesCheck = check(categoriesRes, {
      'categories status 200': (r) => r.status === 200,
    });
    errorRate.add(!categoriesCheck);
    sleep(0.5);
  });
}

export function handleSummary(data) {
  const summary = {
    metrics: {
      total_requests: data.metrics.http_reqs.values.count,
      failed_requests: data.metrics.http_req_failed.values.passes,
      avg_duration_ms: data.metrics.http_req_duration.values.avg,
      p95_duration_ms: data.metrics.http_req_duration.values['p(95)'],
      p99_duration_ms: data.metrics.http_req_duration.values['p(99)'],
      error_rate: data.metrics.errors ? data.metrics.errors.values.rate : 0,
    },
    timestamp: new Date().toISOString(),
  };

  console.log('\n=== Load Test Summary ===');
  console.log(`Total Requests: ${summary.metrics.total_requests}`);
  console.log(`Failed Requests: ${summary.metrics.failed_requests}`);
  console.log(`Error Rate: ${(summary.metrics.error_rate * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${summary.metrics.avg_duration_ms.toFixed(2)}ms`);
  console.log(`95th Percentile: ${summary.metrics.p95_duration_ms.toFixed(2)}ms`);
  console.log(`99th Percentile: ${summary.metrics.p99_duration_ms.toFixed(2)}ms`);

  return {
    'performance/results/load-test-summary.json': JSON.stringify(summary, null, 2),
  };
}
