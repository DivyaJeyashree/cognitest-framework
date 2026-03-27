import { logger } from "../utils/logger";

export class RabbitMqClient {
  async publishExecutionEvent(eventName: string, payload: Record<string, unknown>): Promise<void> {
    logger.info({
      provider: "rabbitmq",
      action: "publish_placeholder",
      eventName,
      payload
    });
  }
}
