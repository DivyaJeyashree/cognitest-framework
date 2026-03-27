import type { TestResult } from "../types";
import { logger } from "../utils/logger";

export class JiraClient {
  async createDefect(test: TestResult): Promise<string> {
    const defectKey = `JIRA-${Date.now()}`;
    logger.info({
      provider: "jira",
      action: "create_defect",
      defectKey,
      testId: test.id,
      mappedWorkItem: `${test.suite}-${test.id}`,
      attachments: test.artifacts.map((artifact) => artifact.path)
    });
    return defectKey;
  }
}
