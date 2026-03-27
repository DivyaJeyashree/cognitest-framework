import { logger } from "../utils/logger";
import { Client } from "pg";

export class DbClient {
  async connect(): Promise<Client | undefined> {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      logger.info({
        provider: "postgres",
        action: "connect_placeholder",
        url: "not-configured"
      });
      return undefined;
    }
    const client = new Client({ connectionString });
    logger.info({
      provider: "postgres",
      action: "connect_placeholder",
      url: connectionString
    });
    return client;
  }
}
