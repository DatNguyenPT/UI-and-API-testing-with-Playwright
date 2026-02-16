import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Stress Test Configuration
// Push the system beyond normal load to find breaking points

const errorRate = new Rate('errors');
const timeouts = new Counter('timeouts');

export const options = {
  stages: [
    { duration: '2m', target: 10 },    // Warm up
    { duration: '3m', target: 30 },    // Moderate load
    { duration: '3m', target: 50 },    // High load
    { duration: '3m', target: 80 },    // Very high load
    { duration: '3m', target: 100 },   // Breaking point
    { duration: '3m', target: 100 },   // Stay at breaking point
    { duration: '3m', target: 0 },     // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // Relaxed for stress test
    http_req_failed: ['rate<0.15'],     // Up to 15% failure acceptable
    errors: ['rate<0.15'],
  },
};

const BASE_URL = __ENV.K6_BASE_URL || 'https://dummyjson.com';

export default function () {
  group('Heavy Product Operations', () => {
    // Multiple product fetches (simulating heavy browsing)
    for (let i = 0; i < 3; i++) {
      let productId = Math.floor(Math.random() * 100) + 1;
      let res = http.get(`${BASE_URL}/products/${productId}`, {
        timeout: '10s',
      });
      
      let passed = check(res, {
        'status is 200-299': (r) => r.status >= 200 && r.status < 300,
      });
      
      errorRate.add(!passed);
      if (res.timings.duration > 8000) {
        timeouts.add(1);
      }
      sleep(0.2);
    }
  });

  group('Heavy User Operations', () => {
    // Paginated user fetches
    let skip = Math.floor(Math.random() * 50);
    let res = http.get(`${BASE_URL}/users?limit=30&skip=${skip}`, {
      timeout: '10s',
    });
    
    let passed = check(res, {
      'users status ok': (r) => r.status >= 200 && r.status < 300,
    });
    
    errorRate.add(!passed);
    sleep(0.3);
  });

  group('Search Operations', () => {
    const terms = ['phone', 'laptop', 'watch', 'camera', 'tablet', 'apple', 'samsung'];
    let term = terms[Math.floor(Math.random() * terms.length)];
    
    let res = http.get(`${BASE_URL}/products/search?q=${term}`, {
      timeout: '10s',
    });
    
    let passed = check(res, {
      'search status ok': (r) => r.status >= 200 && r.status < 300,
    });
    
    errorRate.add(!passed);
    sleep(0.3);
  });

  group('Categories', () => {
    let res = http.get(`${BASE_URL}/products/categories`, {
      timeout: '10s',
    });
    
    let passed = check(res, {
      'categories ok': (r) => r.status >= 200 && r.status < 300,
    });
    
    errorRate.add(!passed);
    sleep(0.2);
  });
}

export function handleSummary(data) {
  const summary = {
    test_type: 'stress',
    metrics: {
      total_requests: data.metrics.http_reqs.values.count,
      failed_requests: data.metrics.http_req_failed.values.passes,
      requests_per_second: data.metrics.http_reqs.values.rate,
      avg_duration_ms: data.metrics.http_req_duration.values.avg,
      p95_duration_ms: data.metrics.http_req_duration.values['p(95)'],
      p99_duration_ms: data.metrics.http_req_duration.values['p(99)'],
      max_duration_ms: data.metrics.http_req_duration.values.max,
      error_rate: data.metrics.errors ? data.metrics.errors.values.rate : 0,
      timeout_count: data.metrics.timeouts ? data.metrics.timeouts.values.count : 0,
    },
    timestamp: new Date().toISOString(),
  };

  console.log('\n=== Stress Test Summary ===');
  console.log(`Total Requests: ${summary.metrics.total_requests}`);
  console.log(`Requests/Second: ${summary.metrics.requests_per_second.toFixed(2)}`);
  console.log(`Failed Requests: ${summary.metrics.failed_requests}`);
  console.log(`Error Rate: ${(summary.metrics.error_rate * 100).toFixed(2)}%`);
  console.log(`Timeout Count: ${summary.metrics.timeout_count}`);
  console.log(`Avg Response Time: ${summary.metrics.avg_duration_ms.toFixed(2)}ms`);
  console.log(`95th Percentile: ${summary.metrics.p95_duration_ms.toFixed(2)}ms`);
  console.log(`99th Percentile: ${summary.metrics.p99_duration_ms.toFixed(2)}ms`);
  console.log(`Max Response Time: ${summary.metrics.max_duration_ms.toFixed(2)}ms`);

  return {
    'performance/results/stress-test-summary.json': JSON.stringify(summary, null, 2),
  };
}
