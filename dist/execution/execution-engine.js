"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionEngine = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const smoke_api_test_1 = require("../tests/api/smoke-api.test");
const smoke_mobile_test_1 = require("../tests/mobile/smoke-mobile.test");
const smoke_web_login_test_1 = require("../tests/web/smoke-web-login.test");
const defect_manager_1 = require("../integrations/defect-manager");
const rabbitmq_client_1 = require("../integrations/rabbitmq-client");
const logger_1 = require("../utils/logger");
const test_runner_service_1 = require("./test-runner-service");
class ExecutionEngine {
    testRunner;
    defectManager;
    rabbitMqClient;
    tests = [smoke_web_login_test_1.smokeWebTest, smoke_api_test_1.smokeApiTest, smoke_mobile_test_1.smokeMobileTest];
    constructor(testRunner = new test_runner_service_1.TestRunnerService(), defectManager = new defect_manager_1.DefectManager(), rabbitMqClient = new rabbitmq_client_1.RabbitMqClient()) {
        this.testRunner = testRunner;
        this.defectManager = defectManager;
        this.rabbitMqClient = rabbitMqClient;
    }
    async execute(request) {
        const startedAt = Date.now();
        await this.rabbitMqClient.publishExecutionEvent("execution_started", { request });
        const filtered = this.filterTests(request);
        const results = await this.testRunner.runTests(filtered, request);
        // attach defectIds
        const provider = (request.defectProvider ?? "none");
        const updated = [];
        for (const result of results) {
            const defectId = await this.defectManager.createForFailure(provider, result);
            updated.push(defectId ? { ...result, defectId } : result);
        }
        const summary = this.buildSummary(request, updated, startedAt, Date.now());
        await this.persistAllureSummary(summary);
        await this.rabbitMqClient.publishExecutionEvent("execution_completed", { summary });
        logger_1.logger.info({ event: "execution_completed", summary });
        return summary;
    }
    filterTests(request) {
        return this.tests.filter((test) => {
            const suiteMatch = request.suite === "all" || test.suite === request.suite;
            const tagMatch = !request.tags || request.tags.length === 0 || request.tags.some((tag) => test.tags.includes(tag));
            return suiteMatch && tagMatch;
        });
    }
    buildSummary(request, results, startedAt, endedAt) {
        const passed = results.filter((r) => r.status === "passed").length;
        const failed = results.filter((r) => r.status === "failed").length;
        const skipped = results.filter((r) => r.status === "skipped").length;
        return { request, total: results.length, passed, failed, skipped, durationMs: endedAt - startedAt, results };
    }
    async persistAllureSummary(summary) {
        const reportDir = node_path_1.default.join(process.cwd(), "reports", "allure-results");
        await promises_1.default.mkdir(reportDir, { recursive: true });
        const reportPath = node_path_1.default.join(reportDir, `execution-${Date.now()}.json`);
        await promises_1.default.writeFile(reportPath, JSON.stringify(summary, null, 2), "utf8");
    }
}
exports.ExecutionEngine = ExecutionEngine;
