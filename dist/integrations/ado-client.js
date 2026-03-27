"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdoClient = void 0;
const logger_1 = require("../utils/logger");
class AdoClient {
    async createBug(test) {
        const workItemId = `ADO-${Date.now()}`;
        logger_1.logger.info({
            provider: "ado",
            action: "create_bug",
            workItemId,
            testId: test.id,
            mappedWorkItem: `${test.suite}-${test.id}`,
            attachments: test.artifacts.map((artifact) => artifact.path)
        });
        return workItemId;
    }
}
exports.AdoClient = AdoClient;
