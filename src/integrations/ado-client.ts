import type { TestResult } from "../types";
import { logger } from "../utils/logger";

export class AdoClient {
  async createBug(test: TestResult): Promise<string> {
    const workItemId = `ADO-${Date.now()}`;
    logger.info({
      provider: "ado",
      action: "create_bug",
      workItemId,
      testId: test.id,
      mappedWorkItem: `${test.suite}-${test.id}`,
      attachments: test.artifacts.map((artifact) => artifact.path)
    });
    return workItemId;
  }
}
