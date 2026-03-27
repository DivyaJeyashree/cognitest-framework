import type { ExecutionRequest, Platform } from "../types";

export interface GeneratedTestCase {
  title: string;
  steps: string[];
  expectedResult: string;
  platform: Platform;
}

export interface TestcaseGeneratorAgent {
  generate(payload: ExecutionRequest): Promise<GeneratedTestCase[]>;
}
