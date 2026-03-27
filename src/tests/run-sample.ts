import { ExecutionEngine } from "../execution/execution-engine";
import type { ExecutionRequest } from "../types";

const payload: ExecutionRequest = {
  suite: "smoke",
  env: "staging",
  tags: ["login", "checkout"],
  parallelism: 2,
  retries: 1,
  failFast: false,
  defectProvider: "none"
};

const run = async (): Promise<void> => {
  const engine = new ExecutionEngine();
  const summary = await engine.execute(payload);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (summary.failed > 0) {
    process.exitCode = 1;
  }
};

void run();
