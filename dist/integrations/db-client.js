"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbClient = void 0;
const logger_1 = require("../utils/logger");
const pg_1 = require("pg");
class DbClient {
    async connect() {
        const connectionString = process.env.POSTGRES_URL;
        if (!connectionString) {
            logger_1.logger.info({
                provider: "postgres",
                action: "connect_placeholder",
                url: "not-configured"
            });
            return undefined;
        }
        const client = new pg_1.Client({ connectionString });
        logger_1.logger.info({
            provider: "postgres",
            action: "connect_placeholder",
            url: connectionString
        });
        return client;
    }
}
exports.DbClient = DbClient;
