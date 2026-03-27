import type { HybridTestCase } from "../../core/base-test";
import { SkipTestError } from "../../core/base-test";

export const smokeMobileTest: HybridTestCase = {
  id: "MOB-001",
  name: "Mobile login smoke validation",
  suite: "smoke",
  platform: "mobile",
  tags: ["login", "mobile"],
  run: async ({ mobileDriver }) => {
    if (process.env.MOBILE_ENABLED !== "true") {
      throw new SkipTestError("Mobile execution disabled");
    }
    if (!mobileDriver) {
      throw new Error("Mobile driver not initialized");
    }
    const currentContext = await mobileDriver.getContext();
    if (!currentContext) {
      throw new Error("Unable to read mobile context");
    }
  }
};
