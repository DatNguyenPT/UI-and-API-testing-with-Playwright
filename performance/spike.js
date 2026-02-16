import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Spike Test Configuration
// Tests system behavior under sudden traffic spikes

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 5 },     // Baseline - normal load
    { duration: '10s', target: 100 },   // SPIKE! Sudden increase to 100 users
    { duration: '1m', target: 100 },    // Maintain spike
    { duration: '10s', target: 5 },     // Drop back to normal
    { duration: '1m', target: 5 },      // Recovery period
    { duration: '10s', target: 150 },   // BIGGER SPIKE!
    { duration: '1m', target: 150 },    // Maintain bigger spike
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<6000'],  // During spikes, allow higher latency
    http_req_failed: ['rate<0.20'],     // Up to 20% failure acceptable during spikes
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'https://dummyjson.com';

export default function () {
  // Simulate typical user journey during spike
  
  // 1. Browse products
  let productsRes = http.get(`${BASE_URL}/products?limit=20`, {
    timeout: '15s',
  });
  let p1 = check(productsRes, {
    'products loaded': (r) => r.status === 200,
  });
  errorRate.add(!p1);
  sleep(0.3);

  // 2. View a product
  let productId = Math.floor(Math.random() * 100) + 1;
  let productRes = http.get(`${BASE_URL}/products/${productId}`, {
    timeout: '15s',
  });
  let p2 = check(productRes, {
    'product loaded': (r) => r.status === 200,
  });
  errorRate.add(!p2);
  sleep(0.3);

  // 3. Search
  const searchTerms = ['phone', 'laptop', 'watch'];
  let term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  let searchRes = http.get(`${BASE_URL}/products/search?q=${term}`, {
    timeout: '15s',
  });
  let p3 = check(searchRes, {
    'search completed': (r) => r.status === 200,
  });
  errorRate.add(!p3);
  sleep(0.3);

  // 4. View categories
  let categoriesRes = http.get(`${BASE_URL}/products/categories`, {
    timeout: '15s',
  });
  let p4 = check(categoriesRes, {
    'categories loaded': (r) => r.status === 200,
  });
  errorRate.add(!p4);
  sleep(0.2);
}

export function handleSummary(data) {
  const summary = {
    test_type: 'spike',
    metrics: {
      total_requests: data.metrics.http_reqs.values.count,
      failed_requests: data.metrics.http_req_failed.values.passes,
      requests_per_second: data.metrics.http_reqs.values.rate,
      avg_duration_ms: data.metrics.http_req_duration.values.avg,
      p95_duration_ms: data.metrics.http_req_duration.values['p(95)'],
      p99_duration_ms: data.metrics.http_req_duration.values['p(99)'],
      max_duration_ms: data.metrics.http_req_duration.values.max,
      error_rate: data.metrics.errors ? data.metrics.errors.values.rate : 0,
    },
    timestamp: new Date().toISOString(),
  };

  console.log('\n=== Spike Test Summary ===');
  console.log(`Total Requests: ${summary.metrics.total_requests}`);
  console.log(`Peak Requests/Second: ${summary.metrics.requests_per_second.toFixed(2)}`);
  console.log(`Failed Requests: ${summary.metrics.failed_requests}`);
  console.log(`Error Rate: ${(summary.metrics.error_rate * 100).toFixed(2)}%`);
  console.log(`Avg Response Time: ${summary.metrics.avg_duration_ms.toFixed(2)}ms`);
  console.log(`95th Percentile: ${summary.metrics.p95_duration_ms.toFixed(2)}ms`);
  console.log(`Max Response Time: ${summary.metrics.max_duration_ms.toFixed(2)}ms`);

  return {
    'performance/results/spike-test-summary.json': JSON.stringify(summary, null, 2),
  };
}
