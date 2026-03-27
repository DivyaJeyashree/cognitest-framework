import { HealthClient } from "../../components/api/health-client";
import type { HybridTestCase } from "../../core/base-test";

export const smokeApiTest: HybridTestCase = {
  id: "API-001",
  name: "Public API health validation",
  suite: "smoke",
  platform: "api",
  tags: ["checkout", "smoke"],
  run: async ({ apiContext }) => {
    if (!apiContext) {
      throw new Error("API context missing");
    }
    const client = new HealthClient(apiContext);
    const response = await client.getHealth();
    if (!response.ok()) {
      throw new Error(`Health endpoint failed with status ${response.status()}`);
    }
    const body = (await response.json()) as { id: number };
    if (body.id !== 1) {
      throw new Error("Unexpected health payload");
    }
  }
};
