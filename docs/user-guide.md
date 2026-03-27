---
title: User Guide
nav_order: 5
---

# Cognitest Engine User Guide

This guide helps you go from setup to your first successful hybrid execution with predictable outcomes.

{: .tip }
If you are starting for the first time, go in this order: sections 2, 4, 6, 7, 9, and 11.

## Quick Navigation

- Setup and prerequisites: sections 2 to 4
- Test authoring model: sections 5 and 6
- Running execution: sections 7 and 8
- Results and reporting: section 9
- End-to-end walkthrough: section 11
- Troubleshooting: section 13
- Role-based learning path: section 14

## 1. Who Is This Guide For

This guide is for a new user who wants to:

- Set up the framework
- Create a test case
- Execute tests
- View results and reports

## 2. Prerequisites

Install the following on your machine:

- Node.js 20+
- npm 10+
- Docker Desktop (optional but recommended)

Optional for full hybrid execution:

- Playwright browser binaries
- Appium server and emulator/device

## 3. Clone and Open Project

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

## 4. Install Dependencies

```bash
npm install
```

Install Playwright Chromium for web testing:

```bash
npx playwright install chromium
```

## 5. Understand Where to Create Test Cases

Use this location pattern:

- Web tests: `src/tests/web/`
- API tests: `src/tests/api/`
- Mobile tests: `src/tests/mobile/`

Reusable page/component objects:

- Web components: `src/components/web/`
- API clients: `src/components/api/`
- Mobile page objects: `src/components/mobile/`

## 6. Create a New Test Case (Step-by-Step)

### Step 1: Choose test type

Decide platform:

- Web
- API
- Mobile

### Step 2: Create test file

Example: create `src/tests/api/order-status.test.ts`

### Step 3: Follow `HybridTestCase` contract

Each test must define:

- `id`
- `name`
- `suite`
- `platform`
- `tags`
- `run(context)`

Example API test:

```ts
import type { HybridTestCase } from "../../core/base-test";

export const orderStatusTest: HybridTestCase = {
  id: "API-010",
  name: "Order status should return 200",
  suite: "smoke",
  platform: "api",
  tags: ["order", "smoke"],
  run: async ({ apiContext }) => {
    if (!apiContext) {
      throw new Error("API context missing");
    }
    const response = await apiContext.get("/orders/1001/status");
    if (!response.ok()) {
      throw new Error(`Status call failed: ${response.status()}`);
    }
  }
};
```

Example Web test:

```ts
import type { HybridTestCase } from "../../core/base-test";
import { CoreActions } from "../../core/core-actions";

export const loginWebTest: HybridTestCase = {
  id: "WEB-010",
  name: "User can open login page and validate heading",
  suite: "smoke",
  platform: "web",
  tags: ["login", "web"],
  run: async ({ page }) => {
    if (!page) {
      throw new Error("Web page context missing");
    }
    await page.goto("https://example.com");
    const heading = await page.locator("h1").textContent();
    if (!heading?.includes("Example Domain")) {
      throw new Error("Expected heading not visible");
    }
    const actions = new CoreActions(page);
    await actions.runAccessibilityAudit();
  }
};
```

Example Mobile test:

```ts
import type { HybridTestCase } from "../../core/base-test";

export const loginMobileTest: HybridTestCase = {
  id: "MOB-010",
  name: "Mobile user can view login screen",
  suite: "smoke",
  platform: "mobile",
  tags: ["login", "mobile"],
  run: async ({ mobileDriver }) => {
    if (!mobileDriver) {
      throw new Error("Mobile driver not initialized");
    }
    const loginButton = await mobileDriver.$("~login");
    if (!(await loginButton.isDisplayed())) {
      throw new Error("Login button not visible on mobile screen");
    }
  }
};
```

### Web vs Mobile onboarding checklist

| Area | Web App Testing | Mobile App Testing |
|---|---|---|
| Test location | `src/tests/web/` | `src/tests/mobile/` |
| Component location | `src/components/web/` | `src/components/mobile/` |
| Driver runtime | Playwright Chromium | Appium + WebdriverIO |
| Local prerequisite | `npx playwright install chromium` | Start Appium server and emulator/device |
| Context used in `run()` | `page` | `mobileDriver` |
| Common selector style | CSS selectors | Accessibility ID (`~login`) |
| Quick run | `npm run test` | `npm run test` |
| Common failure | Browser binary missing | Appium server/device unavailable |
| First troubleshooting step | Reinstall Playwright browser | Verify Appium host/port and device session |

### Step 4: Register test in execution engine

Open `src/execution/execution-engine.ts` and add your test to the `tests` array.

## 7. Execute Tests Locally

### Option A: Run sample execution directly

```bash
npm run test
```

### Option B: Run as microservice and trigger via API

Start server:

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

Trigger run:

```bash
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "suite": "smoke",
    "env": "staging",
    "tags": ["login", "checkout"],
    "parallelism": 2,
    "retries": 1,
    "failFast": false,
    "defectProvider": "none"
  }'
```

## 8. Filter and Control Execution

Use payload options:

- `suite`: run specific suite
- `tags`: run by tags
- `parallelism`: number of workers
- `retries`: retry failed tests
- `failFast`: stop on first failure
- `defectProvider`: `jira`, `ado`, `both`, or `none`

## 9. View Results

### JSON Summary

The response from `/execute` returns:

- total/passed/failed/skipped
- per-test details
- timing
- error and artifact paths

### Allure Artifacts

Generated under:

```text
reports/allure-results/
```

Generate report:

```bash
npm run allure:generate
```

Then open:

```text
reports/allure-report/index.html
```

## 10. Run with Docker Compose

This starts:

- Cognitest engine
- Appium
- PostgreSQL
- RabbitMQ

```bash
docker compose up --build
```

Service endpoint:

```text
http://localhost:3000
```

## 11. Detailed Walkthrough (From Zero to First Execution)

### Step 1: Install and validate setup

Run:

```bash
npm install
npx playwright install chromium
npm run typecheck
```

Expected outcome:

- Dependencies install without errors
- Browser runtime is available for web execution
- Type system is clean before your first run

### Step 2: Add one focused test

Create one small test in `src/tests/api/` or `src/tests/web/`.
Start with a smoke-level assertion so failures are easy to diagnose.

### Step 3: Register test and run locally

Register the test in `src/execution/execution-engine.ts` and run:

```bash
npm run test
```

Expected outcome:

- You get a clear pass/fail record for each selected test
- Execution time and errors are visible in terminal output

### Step 4: Trigger same run through service API

Start service and trigger execution:

```bash
npm run dev
curl -X POST http://localhost:3000/execute \
  -H "Content-Type: application/json" \
  -d '{"suite":"smoke","env":"staging","tags":["login"],"parallelism":1,"retries":0,"failFast":false,"defectProvider":"none"}'
```

Expected outcome:

- API returns JSON summary
- Result shape is suitable for CI and dashboard integrations

### Step 5: Inspect artifacts and iterate

- Check `reports/allure-results/` after execution
- Generate HTML report with `npm run allure:generate`
- Add tags and suites to improve selective execution

## 12. New User Workflow Summary

1. Install dependencies
2. Add/modify test in `src/tests/*`
3. Register test in execution engine
4. Run locally (`npm run test`) or via API (`npm run dev` + `/execute`)
5. Review JSON summary and Allure output
6. Iterate with suite/tag filtering

## 13. Common Troubleshooting

### Web test skipped or fails due to browser missing

Run:

```bash
npx playwright install chromium
```

### Mobile test skipped or fails due to Appium

Ensure Appium server is running at configured host/port or use Docker Compose.

### TypeScript validation

```bash
npm run typecheck
```

### Lint validation

```bash
npm run lint
```

## 14. Role-Based Quick Paths

### QA Engineer

1. Read sections 2, 4, and 5 for setup and folder conventions.
2. Use section 6 to write one web or API smoke test.
3. Run section 7 Option A to validate local execution.
4. Use section 9 to read summary and report outputs.

### SDET

1. Read sections 6 and 8 for payload-driven execution control.
2. Follow section 11 to move from local test to API-triggered run.
3. Add suite and tag strategies from sections 8 and 12.
4. Use section 13 for fast troubleshooting loops.

### QA Lead or Test Manager

1. Read sections 8, 9, and 12 to standardize run controls and outputs.
2. Align your team on suite naming and tag taxonomy.
3. Use API-triggered execution from section 7 Option B for CI adoption.
4. Track pass/fail and artifact quality through Allure outputs.
