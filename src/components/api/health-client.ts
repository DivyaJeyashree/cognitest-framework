import type { APIRequestContext, APIResponse } from "playwright";

export class HealthClient {
  constructor(private readonly client: APIRequestContext) {}

  async getHealth(): Promise<APIResponse> {
    return this.client.get("/posts/1");
  }
}
