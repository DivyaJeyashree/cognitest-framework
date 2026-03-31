import type { TestContext } from "../../../core/base-test";

export const getBranches = async (context: TestContext) => {
  if (!context.apiContext) {
    throw new Error("API context missing");
  }

  const endpoint = "/branches";
  console.log("[API] GET", endpoint);
  return await context.apiContext.get(endpoint);
};