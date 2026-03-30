import { AllureRuntime, AllureTest, Status } from "allure-js-commons";
import path from "node:path";
import fs from "node:fs";

// IMPORTANT: must match Docker mount path
const resultsDir = path.join(process.cwd(), "reports", "allure-results");

// Ensure folder exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

export const allureRuntime = new AllureRuntime({
  resultsDir,
});

export function startAllureTest(name: string): AllureTest {
  return allureRuntime.startTest(name);
}

export function endAllureTest(test: AllureTest, status: "passed" | "failed" | "skipped", error?: string) {
  if (status === "passed") {
    test.status = Status.PASSED;
  } else if (status === "failed") {
    test.status = Status.FAILED;
    if (error) test.statusDetails = { message: error };
  } else {
    test.status = Status.SKIPPED;
  }

  test.endTest();
  allureRuntime.writeResult(test);
}
