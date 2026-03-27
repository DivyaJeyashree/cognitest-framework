"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraClient = void 0;
const logger_1 = require("../utils/logger");
class JiraClient {
    async createDefect(test) {
        const defectKey = `JIRA-${Date.now()}`;
        logger_1.logger.info({
            provider: "jira",
            action: "create_defect",
            defectKey,
            testId: test.id,
            mappedWorkItem: `${test.suite}-${test.id}`,
            attachments: test.artifacts.map((artifact) => artifact.path)
        });
        return defectKey;
    }
}
exports.JiraClient = JiraClient;
