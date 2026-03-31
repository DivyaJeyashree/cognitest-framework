import { getSupportDetails } from "../actions/support.api.actions";
import type { HybridTestCase, TestContext } from "../../../core/base-test";

const supportApiTest: HybridTestCase = {
  id: "API-004",
  name: "Support API Test",
  suite: "smoke",
  platform: "api",
  tags: ["support"],

  run: async (context: TestContext) => {
    console.log("[TEST] Starting API-004: Support API Test");
    const response = await getSupportDetails(context);

    const body = await response.json();

    context.artifacts?.push({
      name: "API Request",
      type: "log",
      path: "",
      content: JSON.stringify({ endpoint: "/support", method: "GET" }, null, 2)
    });
    context.artifacts?.push({
      name: "API Response",
      type: "log",
      path: "",
      content: JSON.stringify(body, null, 2)
    });

    console.log("[TEST API-004] Status:", response.status());
    if (response.status() !== 200) {
      throw new Error(`Support API failed with status ${response.status()}`);
    }

    console.log("[TEST API-004] Response:", body);

    if (!body.email) {
      throw new Error("Support email missing in response");
    }
    console.log("[TEST] API-004 Passed");
  }
};

export default supportApiTest;