"use strict";
// File: src/execution/test-runner-service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunnerService = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const api_driver_1 = require("../core/drivers/api-driver");
const mobile_driver_1 = require("../core/drivers/mobile-driver");
const web_driver_1 = require("../core/drivers/web-driver");
const base_test_1 = require("../core/base-test");
const logger_1 = require("../utils/logger");
// Helper to detect infrastructure errors
const isInfraDependencyError = (message) => message.includes("playwright install") ||
    message.includes("Executable doesn't exist") ||
    message.includes("Unable to connect to \"http://127.0.0.1:4723/wd/hub\"");
class TestRunnerService {
    webDriver;
    apiDriver;
    mobileDriver;
    constructor(webDriver = new web_driver_1.WebDriver(), apiDriver = new api_driver_1.ApiDriver(), mobileDriver = new mobile_driver_1.MobileDriver()) {
        this.webDriver = webDriver;
        this.apiDriver = apiDriver;
        this.mobileDriver = mobileDriver;
    }
    // Run multiple tests in parallel
    async runTests(tests, request) {
        const parallelism = Math.max(1, request.parallelism ?? 2);
        const queue = [...tests];
        const results = [];
        let shouldStop = false;
        const worker = async () => {
            while (queue.length > 0) {
                if (request.failFast && shouldStop)
                    return;
                const test = queue.shift();
                if (!test)
                    return;
                const result = await this.runSingleTest(test, request);
                results.push(result);
                if (request.failFast && result.status === "failed") {
                    shouldStop = true;
                    return;
                }
            }
        };
        await Promise.all(Array.from({ length: parallelism }, () => worker()));
        return results;
    }
    // Run a single test with retries
    async runSingleTest(test, request) {
        const retries = Math.max(0, request.retries ?? 1);
        let attempt = 0;
        let finalResult;
        while (attempt <= retries) {
            finalResult = await this.executeAttempt(test, request, attempt);
            if (finalResult.status === "passed" || finalResult.status === "skipped") {
                return finalResult;
            }
            attempt += 1;
        }
        return finalResult ?? (0, base_test_1.makeResult)(test, "failed", Date.now(), Date.now(), retries, [], "Unknown");
    }
    // Execute a single attempt of a test
    async executeAttempt(test, request, attempt) {
        const startedAt = Date.now();
        const artifacts = [];
        const context = { env: request.env ?? "" }; // <-- fixed undefined issue
        const runId = `${test.id}-${Date.now()}-${attempt}`;
        try {
            // Web platform
            if (test.platform === "web") {
                const webSession = await this.webDriver.startSession(runId);
                context.browser = webSession.browser;
                context.browserContext = webSession.context;
                context.page = webSession.page;
            }
            // API platform
            if (test.platform === "api") {
                context.apiContext = await this.apiDriver.startSession("https://jsonplaceholder.typicode.com");
            }
            // Mobile platform
            if (test.platform === "mobile") {
                context.mobileDriver = await this.mobileDriver.startSession(context.env);
            }
            // Run the test
            await test.run(context);
            const endedAt = Date.now();
            return (0, base_test_1.makeResult)(test, "passed", startedAt, endedAt, attempt, artifacts);
        }
        catch (error) {
            const endedAt = Date.now();
            if (error instanceof base_test_1.SkipTestError) {
                return (0, base_test_1.makeResult)(test, "skipped", startedAt, endedAt, attempt, artifacts, error.message);
            }
            const errorMessage = error instanceof Error ? error.message : "unknown error";
            if (isInfraDependencyError(errorMessage)) {
                return (0, base_test_1.makeResult)(test, "skipped", startedAt, endedAt, attempt, artifacts, errorMessage);
            }
            // Take screenshot for web failures
            if (context.page) {
                const screenshotPath = node_path_1.default.join(process.cwd(), "reports", `${runId}.png`);
                await promises_1.default.mkdir(node_path_1.default.dirname(screenshotPath), { recursive: true });
                await context.page.screenshot({ path: screenshotPath, fullPage: true });
                artifacts.push({ type: "screenshot", path: screenshotPath });
            }
            logger_1.logger.error({
                event: "test_failure",
                testId: test.id,
                attempt,
                message: errorMessage
            });
            return (0, base_test_1.makeResult)(test, "failed", startedAt, endedAt, attempt, artifacts, errorMessage);
        }
        finally {
            // Clean up sessions
            if (context.apiContext) {
                await this.apiDriver.stopSession(context.apiContext);
            }
            if (context.mobileDriver) {
                await this.mobileDriver.stopSession(context.mobileDriver);
            }
            if (context.browser && context.browserContext && context.page) {
                const video = context.page.video();
                if (video) {
                    const videoPath = await video.path();
                    logger_1.logger.info({ event: "video_captured", path: videoPath, testId: test.id });
                }
                await this.webDriver.stopSession({
                    browser: context.browser,
                    context: context.browserContext,
                    page: context.page
                });
            }
        }
    }
}
exports.TestRunnerService = TestRunnerService;
