import { ExecutionEngine } from "./src/execution/execution-engine";

async function main() {
  const engine = new ExecutionEngine();

  const summary = await engine.execute({
    suite: "smoke",
    tags: [],
    env: "qa",          // 🔥 will control BASE_URL
    retries: 1,
    parallelism: 2,
    failFast: false,
    defectProvider: "none"
  });

  console.log("FINAL SUMMARY:");
  console.log(JSON.stringify(summary, null, 2));
}

main();