"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqClient = void 0;
const logger_1 = require("../utils/logger");
class RabbitMqClient {
    async publishExecutionEvent(eventName, payload) {
        logger_1.logger.info({
            provider: "rabbitmq",
            action: "publish_placeholder",
            eventName,
            payload
        });
    }
}
exports.RabbitMqClient = RabbitMqClient;
