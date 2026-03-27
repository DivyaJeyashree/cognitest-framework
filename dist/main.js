"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const env_loader_1 = require("./config/env-loader");
const execution_engine_1 = require("./execution/execution-engine");
const logger_1 = require("./utils/logger");
const buildServer = () => {
    const app = (0, fastify_1.default)({ logger: false });
    const engine = new execution_engine_1.ExecutionEngine();
    app.get("/health", async () => ({ status: "ok", service: "cognitest-engine" }));
    app.post("/execute", {
        schema: {
            body: {
                type: "object",
                required: ["suite", "env", "tags"],
                properties: {
                    suite: { type: "string" },
                    env: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    parallelism: { type: "number" },
                    retries: { type: "number" },
                    failFast: { type: "boolean" },
                    defectProvider: { type: "string" }
                }
            }
        }
    }, async (request, reply) => {
        const payload = request.body;
        const enriched = {
            ...payload,
            tags: payload.tags ?? [],
            retries: payload.retries ?? 1,
            parallelism: payload.parallelism ?? 2,
            failFast: payload.failFast ?? false,
            defectProvider: payload.defectProvider ?? "none"
        };
        const summary = await engine.execute(enriched);
        return reply.send(summary);
    });
    return app;
};
const start = async () => {
    const env = (0, env_loader_1.loadEnv)();
    const app = buildServer();
    try {
        await app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
        logger_1.logger.info({ event: "service_started", nodeEnv: env.nodeEnv });
    }
    catch (error) {
        logger_1.logger.error({
            event: "service_start_failed",
            message: error instanceof Error ? error.message : "unknown error"
        });
        process.exit(1);
    }
};
void start();
