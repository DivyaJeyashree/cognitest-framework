export type Platform = "web" | "api" | "mobile";

export type TestStatus = "passed" | "failed" | "skipped";

export interface ExecutionRequest {
  suite: string;
  env: string;
  tags: string[];
  parallelism?: number;
  retries?: number;
  failFast?: boolean;
  defectProvider?: "jira" | "ado" | "both" | "none";
   baseUrl?: string;
}

export interface TestArtifact {
  type: "screenshot" | "video" | "log" | "report";
  path: string;
}

export interface TestResult {
  id: string;
  name: string;
  suite: string;
  platform: Platform;
  tags: string[];
  status: TestStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  retries: number;
  error?: string;
  artifacts: TestArtifact[];
  defectId?: string;
}

export interface ExecutionSummary {
  request: ExecutionRequest;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
  results: TestResult[];
}
