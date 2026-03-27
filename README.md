# Cognitest Engine

Cognitest Engine is an enterprise-ready hybrid automation execution service built with Node.js and TypeScript. It supports web, API, and mobile test execution through a single REST-triggered microservice.

## Capabilities

- Web automation with Playwright
- API automation using Playwright request context
- Native mobile automation with Appium + WebdriverIO
- Suite-driven and tag-driven execution filtering
- Parallel execution, retry handling, and fail-fast behavior
- Screenshot and video capture for failing scenarios
- JIRA and Azure DevOps defect automation placeholders
- Self-healing locator fallback placeholder
- Accessibility scanning via axe-core
- Visual regression utility with screenshot diffing
- Allure result artifact generation
- RabbitMQ and PostgreSQL integration placeholders
- Cloud-agnostic Docker and Kubernetes readiness

## Project Structure

```text
<repo-root>/
├── src/
├── reports/
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── azure-pipelines.yml
└── helm-chart/
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional)
- Appium server (optional for mobile execution)

## Install and Build

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

## Run as Microservice

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

Trigger execution:

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

## Run Sample Hybrid Execution

```bash
npm run test
```

## Allure Report

```bash
npm run allure:generate
```

Generated report location:

```text
reports/allure-report
```

## Docker

Build image:

```bash
docker build -t cognitest-engine:latest .
```

Run service:

```bash
docker run --rm -p 3000:3000 cognitest-engine:latest
```

Run complete execution environment:

```bash
docker compose up --build
```

## Kubernetes Helm Starter

```bash
helm install cognitest-engine ./helm-chart
```

## Future Expansion

- AI testcase generation and self-healing enhancements
- Low-code workflow orchestration
- Distributed worker scaling with queue-backed scheduling
