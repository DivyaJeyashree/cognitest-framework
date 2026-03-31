import type { TestContext } from "../../../core/base-test";

export const getRate = async (
  context: TestContext,
  amount: string,
  currency: string
) => {
  if (!context.apiContext) {
    throw new Error("API context missing");
  }

  const endpoint = "/rate";
  const payload = { amount: Number(amount), currency: currency };
  console.log("[API] POST", endpoint, "with payload:", payload);
  return await context.apiContext.post(endpoint, {
    data: payload
  });
};