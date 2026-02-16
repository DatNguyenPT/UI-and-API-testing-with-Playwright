// K6 Performance Testing Scripts for DummyJSON API
//
// Installation:
//   - Windows: choco install k6 or winget install k6
//   - macOS: brew install k6
//   - Linux: See https://k6.io/docs/getting-started/installation/
//
// Usage:
//   k6 run performance/smoke.js          # Quick smoke test
//   k6 run performance/load.js           # Standard load test
//   k6 run performance/stress.js         # Stress test
//   k6 run performance/spike.js          # Spike test
//
// Environment Variables:
//   K6_BASE_URL - Base URL (default: https://dummyjson.com)
//
// Reports:
//   k6 run --out json=results.json performance/load.js
//   k6 run --out influxdb=http://localhost:8086/k6 performance/load.js
