import { getRate } from "../actions/rate.api.actions";
import type { HybridTestCase, TestContext } from "../../../core/base-test";

const rateApiTest: HybridTestCase = {
  id: "API-002",
  name: "Rate API Test",
  suite: "smoke",
  platform: "api",
  tags: ["rate"],

  run: async (context: TestContext) => {
    console.log("[TEST] Starting API-002: Rate API Test");

    const payload = { amount: 100, currency: "USD" };
    const response = await getRate(context, "100", "USD");

    const body = await response.json();

    context.artifacts?.push({
      name: "API Request",
      type: "log",
      path: "",
      content: JSON.stringify(payload, null, 2)
    });
    context.artifacts?.push({
      name: "API Response",
      type: "log",
      path: "",
      content: JSON.stringify(body, null, 2)
    });

    console.log("[TEST API-002] Status:", response.status());
    if (response.status() !== 200) {
      throw new Error(`Rate API failed with status ${response.status()}`);
    }

    console.log("[TEST API-002] Response:", body);

    if (!body.convertedAmount) {
      throw new Error("Converted amount missing in response");
    }
    console.log("[TEST] API-002 Passed");
  }
};

export default rateApiTest;