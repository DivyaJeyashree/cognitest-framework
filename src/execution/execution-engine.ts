import fs from "node:fs/promises";
import path from "node:path";
import { smokeApiTest } from "../tests/api/smoke-api.test";
import { smokeMobileTest } from "../tests/mobile/smoke-mobile.test";
import { smokeWebTest } from "../tests/web/smoke-web.test";
import { LoginTests } from "../tests/web/login.test";
import type { HybridTestCase } from "../core/base-test";
import { DefectManager } from "../integrations/defect-manager";
import { RabbitMqClient } from "../integrations/rabbitmq-client";
import type { ExecutionRequest, ExecutionSummary, TestResult } from "../types";
import { logger } from "../utils/logger";
import { TestRunnerService } from "./test-runner-service";
import { BASE_URL } from "../config/env";
export class ExecutionEngine {
  private readonly tests: HybridTestCase[] = [
    smokeWebTest,
    ...LoginTests,
    smokeApiTest,
    smokeMobileTest,
  ];

  constructor(
    private readonly testRunner = new TestRunnerService(),
    private readonly defectManager = new DefectManager(),
    private readonly rabbitMqClient = new RabbitMqClient()
  ) {}

  async execute(request: ExecutionRequest): Promise<ExecutionSummary> {
    const startedAt = Date.now();
    await this.rabbitMqClient.publishExecutionEvent("execution_started", { request });

    const filtered = this.filterTests(request);
    const results = await this.testRunner.runTests(filtered, {
  ...request,
  baseUrl: BASE_URL, // ✅ ADD THIS
});
    const withDefects = await this.attachDefects(request, results);

    const summary = this.buildSummary(request, withDefects, startedAt, Date.now());
    await this.persistAllureSummary(summary);
    await this.rabbitMqClient.publishExecutionEvent("execution_completed", { summary });

    logger.info({ event: "execution_completed", summary });
    return summary;
  }

  private filterTests(request: ExecutionRequest): HybridTestCase[] {
    return this.tests.filter((test) => {
      const suiteMatch = request.suite === "all" || test.suite === request.suite;
      const tagMatch =
        request.tags.length === 0 || request.tags.some((tag) => test.tags.includes(tag));
      return suiteMatch && tagMatch;
    });
  }

  private async attachDefects(
    request: ExecutionRequest,
    results: TestResult[]
  ): Promise<TestResult[]> {
    const provider = request.defectProvider ?? "none";
    const updated: TestResult[] = [];

    for (const result of results) {
      const defectId = await this.defectManager.createForFailure(provider, result);
      updated.push(defectId ? { ...result, defectId } : result);
    }
    return updated;
  }

  private buildSummary(
    request: ExecutionRequest,
    results: TestResult[],
    startedAt: number,
    endedAt: number
  ): ExecutionSummary {
    const passed = results.filter((result) => result.status === "passed").length;
    const failed = results.filter((result) => result.status === "failed").length;
    const skipped = results.filter((result) => result.status === "skipped").length;

    return {
      request,
      total: results.length,
      passed,
      failed,
      skipped,
      durationMs: endedAt - startedAt,
      results,
    };
  }

  private async persistAllureSummary(summary: ExecutionSummary): Promise<void> {
    const reportDir = path.join(process.cwd(), "reports", "allure-results");
    await fs.mkdir(reportDir, { recursive: true });

    const reportPath = path.join(reportDir, `execution-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(summary, null, 2), "utf8");
  }
}