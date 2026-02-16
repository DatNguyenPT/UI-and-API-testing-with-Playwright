# Playwright Automation Vibe Coding Project

This repository contains an automation testing project built with **Playwright** using **TypeScript**, covering:

- ✅ UI automation testing (SauceDemo - Login, Products, Cart, Checkout)
- ✅ API automation testing (DummyJSON - Auth, Users, Products)
- ✅ Visual regression testing (Screenshot comparison)
- ✅ Performance testing (k6 load/stress/spike tests)
- ✅ CI/CD with GitHub Actions (Allure reports, Discord notifications)
- ✅ Docker containerization for consistent test execution

The project is designed with **SDET / Test Engineer best practices** in mind.

---

## Tech Stack

- **Playwright** - Browser automation
- **TypeScript** - Type-safe testing
- **Node.js** - Runtime environment
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerized test execution
- **Allure** - Test reporting
- **k6** - Performance testing
- **dotenv** - Environment variables

---

## Project Structure

```
├── 📁 .github
│   ├── 📁 pages
│   │   └── 📄 index.html          # Allure landing page
│   └── 📁 workflows
│       ├── ⚙️ ui-test.yaml        # UI tests workflow
│       ├── ⚙️ api-test.yaml       # API tests workflow
│       ├── ⚙️ pr-check.yaml       # PR smoke tests
│       ├── ⚙️ scheduled-regression.yaml
│       └── ⚙️ performance-test.yaml # k6 performance tests
├── 📁 api
│   ├── 📄 BaseApi.ts              # Base API class
│   ├── 📄 AuthApi.ts              # Auth endpoints
│   ├── 📄 UsersApi.ts             # Users endpoints
│   ├── 📄 ProductsApi.ts          # Products endpoints
│   └── 📄 StatusCode.ts           # HTTP status codes
├── 📁 fixtures
│   ├── 📄 APIEndpoints.fixture.ts
│   ├── 📄 Cart.fixture.ts
│   ├── 📄 login.fixture.ts
│   └── 📄 MainPage.fixture.ts
├── 📁 pages
│   ├── 📄 BasePage.ts
│   ├── 📄 LoginPage.ts
│   ├── 📄 MainPage.ts
│   ├── 📄 CartPage.ts
│   ├── 📄 CheckoutStepOnePage.ts
│   ├── 📄 CheckoutStepTwoPage.ts
│   └── 📄 CheckoutCompletePage.ts
├── 📁 performance              # k6 performance tests
│   ├── 📄 smoke.js             # Quick validation
│   ├── 📄 load.js              # Normal load test
│   ├── 📄 stress.js            # Breaking point test
│   ├── 📄 spike.js             # Traffic spike test
│   └── 📁 results              # Test results
├── 📁 snapshots                # Visual regression baselines
├── 📁 tests
│   ├── 📁 API
│   │   ├── 📄 login.api.spec.ts
│   │   ├── 📄 users.api.spec.ts
│   │   └── 📄 products.api.spec.ts
│   └── 📁 UI
│       ├── 📄 login.spec.ts
│       ├── 📄 product.spec.ts
│       ├── 📄 product-detail.spec.ts
│       ├── 📄 cart.spec.ts
│       ├── 📄 checkout.spec.ts
│       └── 📄 visual.spec.ts   # Visual regression tests
├── 📁 utils
│   └── 📄 logger.ts
├── 🐳 Dockerfile
├── 🐳 docker-compose.yml
├── ⚙️ playwright.config.ts
└── 📝 README.md
```

---

## Prerequisites

- Node.js **v18+**
- npm
- Git
- Docker (optional, for containerized runs)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/DatNguyenPT/UI-and-API-testing-with-Playwright.git
cd UI-and-API-testing-with-Playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy environment variables
cp .env
```

---

## Run Tests Locally

```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run tests in headed mode
npm run test:headed
```

---

## Run Tests with Docker

```bash
# Build Docker image
npm run docker:build

# Run UI tests in container
npm run docker:ui

# Run UI smoke tests in container
npm run docker:ui:smoke

# Run API tests in container
npm run docker:api

# Run all tests in container
npm run docker:all

# Start Allure report server (http://localhost:5050)
npm run docker:allure
```

---

## Test Reports

### Playwright HTML Report
```bash
npm run report
```

### Allure Report
```bash
npm run allure:generate
npm run allure:open
```

### GitHub Pages Reports
- **UI Tests:** https://datnguyenpt.github.io/UI-and-API-testing-with-Playwright/ui/
- **API Tests:** https://datnguyenpt.github.io/UI-and-API-testing-with-Playwright/api/

---

## Visual Regression Testing

Visual regression tests capture screenshots of key pages and compare them against baseline images.

```bash
# Run visual regression tests
npm run test:visual

# Update baseline snapshots (run when UI intentionally changes)
npm run test:visual:update
```

**Covered pages:**
- Login page (authenticated and error states)
- Inventory/Products page
- Product detail page
- Cart page (empty and with items)
- Checkout flow pages (step one, step two, complete)

Snapshots are stored in the `snapshots/` directory.

---

## Performance Testing (k6)

Performance tests using k6 to measure API performance under various load conditions.

### Prerequisites

Install k6:
```bash
# Windows (chocolatey)
choco install k6

# macOS
brew install k6

# Ubuntu/Debian
sudo apt-get install k6
```

### Run Performance Tests

```bash
# Smoke test - quick validation (1 VU, 30s)
npm run perf:smoke

# Load test - simulate typical production load (10-20 VUs, 10 min)
npm run perf:load

# Stress test - find breaking points (up to 100 VUs, 20 min)
npm run perf:stress

# Spike test - sudden traffic spikes (up to 150 VUs)
npm run perf:spike
```

### Test Types

| Test Type | VUs | Duration | Purpose |
|-----------|-----|----------|---------|
| Smoke | 1 | 30s | Quick API health check |
| Load | 10-20 | 10 min | Normal production load |
| Stress | 10-100 | 20 min | Find system limits |
| Spike | 5-150 | 5 min | Test sudden traffic bursts |

Results are saved to `performance/results/`.

---

## CI/CD Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| UI Tests | Push to main/master | Full UI test suite with 3 browsers × 3 shards |
| API Tests | Push to main/master | Full API test suite |
| PR Smoke Tests | Pull requests | Fast smoke tests for PR validation |
| Scheduled Regression | Daily 6AM UTC | Full regression suite |
| Performance Tests | Manual / Weekly | k6 performance tests (smoke/load/stress/spike) |

---

## Test Tags

- `@smoke` - Quick validation tests
- `@regression` - Full test coverage
- `@critical` - Business-critical flows
- `@visual` - Visual regression tests
