import { request, type APIRequestContext } from "playwright";

export class ApiDriver {
  async startSession(baseURL?: string): Promise<APIRequestContext> {
    return request.newContext({ baseURL, ignoreHTTPSErrors: true });
  }

  async stopSession(context: APIRequestContext): Promise<void> {
    await context.dispose();
  }
}
