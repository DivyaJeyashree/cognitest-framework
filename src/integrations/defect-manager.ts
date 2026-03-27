import type { TestResult } from "../types";
import { AdoClient } from "./ado-client";
import { JiraClient } from "./jira-client";

export class DefectManager {
  constructor(
    private readonly jiraClient = new JiraClient(),
    private readonly adoClient = new AdoClient()
  ) {}

  async createForFailure(
    provider: "jira" | "ado" | "both" | "none",
    result: TestResult
  ): Promise<string | undefined> {
    if (result.status !== "failed" || provider === "none") {
      return undefined;
    }
    if (provider === "jira") {
      return this.jiraClient.createDefect(result);
    }
    if (provider === "ado") {
      return this.adoClient.createBug(result);
    }
    const [jiraId, adoId] = await Promise.all([
      this.jiraClient.createDefect(result),
      this.adoClient.createBug(result)
    ]);
    return `${jiraId},${adoId}`;
  }
}
