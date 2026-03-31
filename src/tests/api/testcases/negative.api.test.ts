
import type { HybridTestCase, TestContext } from "../../../core/base-test";

const negativeApiTest: HybridTestCase = {
  id: "API-005",
  name: "Negative Test - Invalid Currency Code",
  platform: "api",
  suite: "smoke",
  tags: ["api", "negative"],

  run: async (context: TestContext) => {
    if (!context.apiContext) {
      throw new Error("API context missing");
    }

    console.log("[API] POST /rate with INVALID currency");

    const payload = {
      amount: 100,
      currency: "INVALID"
    };

    const response = await context.apiContext.post("/rate", {
      data: payload
    });

    const responseBody = await response.json();

    context.artifacts?.push({
      name: "API Request",
      type: "log",
      path: "",
      content: JSON.stringify({ endpoint: "/rate", method: "POST", payload }, null, 2)
    });
    context.artifacts?.push({
      name: "API Response",
      type: "log",
      path: "",
      content: JSON.stringify(responseBody, null, 2)
    });

    console.log(`[TEST API-005] Status: ${response.status()}`);
    console.log(`[TEST API-005] Response:`, responseBody);

    if (response.status() === 200) {
      throw new Error("Negative test failed: API accepted invalid currency");
    }
  }
};

export default negativeApiTest;