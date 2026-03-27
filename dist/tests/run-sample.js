"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execution_engine_1 = require("../execution/execution-engine");
const payload = {
    suite: "smoke",
    env: "staging",
    tags: ["login", "checkout"],
    parallelism: 2,
    retries: 1,
    failFast: false,
    defectProvider: "none"
};
const run = async () => {
    const engine = new execution_engine_1.ExecutionEngine();
    const summary = await engine.execute(payload);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (summary.failed > 0) {
        process.exitCode = 1;
    }
};
void run();
