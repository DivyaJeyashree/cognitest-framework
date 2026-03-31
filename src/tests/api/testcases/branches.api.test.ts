import { getBranches } from "../actions/branches.api.actions";
import type { HybridTestCase, TestContext } from "../../../core/base-test";

const branchesApiTest: HybridTestCase = {
  id: "API-003",
  name: "Branches API Test",
  suite: "smoke",
  platform: "api",
  tags: ["branches"],

  run: async (context: TestContext) => {
    console.log("[TEST] Starting API-003: Branches API Test");
    const response = await getBranches(context);

    const body = await response.json();

    context.artifacts?.push({
      name: "API Request",
      type: "log",
      path: "",
      content: JSON.stringify({ endpoint: "/branches", method: "GET" }, null, 2)
    });
    context.artifacts?.push({
      name: "API Response",
      type: "log",
      path: "",
      content: JSON.stringify(body, null, 2)
    });

    console.log("[TEST API-003] Status:", response.status());
    if (response.status() !== 200) {
      throw new Error(`Branches API failed with status ${response.status()}`);
    }

    console.log("[TEST API-003] Response:", body);

    if (!body.branches) {
      throw new Error("Branches data missing in response");
    }
    console.log("[TEST] API-003 Passed");
  }
};

export default branchesApiTest;