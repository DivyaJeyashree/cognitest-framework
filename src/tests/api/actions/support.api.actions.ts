import type { TestContext } from "../../../core/base-test";

export const getSupportDetails = async (context: TestContext) => {
  if (!context.apiContext) {
    throw new Error("API context missing");
  }

  const endpoint = "/support";
  console.log("[API] GET", endpoint);
  return await context.apiContext.get(endpoint);
};