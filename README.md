# Playwright Automation Project

This repository contains an automation testing project built with **Playwright** using **TypeScript**, covering:

- ✅ UI automation testing (Login flow)
- ✅ API automation testing (FakeStore API – local only)
- ✅ CI pipeline with GitHub Actions (UI tests)

The project is designed with **SDET / Test Engineer best practices** in mind.

---

## Tech Stack

- **Playwright**
- **TypeScript**
- **Node.js**
- **GitHub Actions** (CI)
- **dotenv** (environment variables)

---

## Project Structure

```
├── 📁 .github
│   └── 📁 workflows
│       └── ⚙️ playwright.yaml
├── 📁 fixtures
│   ├── 📄 api-endpoint.fixture.ts
│   └── 📄 login.fixture.ts
├── 📁 pages
│   └── 📄 LoginPage.ts
├── 📁 tests
│   ├── 📁 API
│   │   └── 📄 login.api.spec.ts
│   └── 📁 UI
│       └── 📄 login.spec.ts
├── 📁 utils
│   └── 📄 logger.ts
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── 📄 playwright.config.ts
```
## Prerequisites

- Node.js **v18+**
- npm or yarn
- Git
- Playwright

---

## Run tests
Run all tests
```bash
npx playwright test
```
Run UI tests only
```bash
npx playwright test tests/ui
```
Run API tests only
```bash
npx playwright test api
```
