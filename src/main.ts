import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { loadEnv } from "./config/env-loader";
import { ExecutionEngine } from "./execution/execution-engine";
import type { ExecutionRequest } from "./types";
import { logger } from "./utils/logger";

const buildServer = (): FastifyInstance => {
  const app = Fastify({ logger: false });
  const engine = new ExecutionEngine();

  app.get("/health", async () => ({ status: "ok", service: "cognitest-engine" }));

  app.post<{ Body: ExecutionRequest }>(
    "/execute",
    {
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
    },
    async (
      request: FastifyRequest<{ Body: ExecutionRequest }>,
      reply: FastifyReply
    ) => {
    const payload = request.body;
    const enriched: ExecutionRequest = {
      ...payload,
      tags: payload.tags ?? [],
      retries: payload.retries ?? 1,
      parallelism: payload.parallelism ?? 2,
      failFast: payload.failFast ?? false,
      defectProvider: payload.defectProvider ?? "none"
    };

    const summary = await engine.execute(enriched);
    return reply.send(summary);
    }
  );

  return app;
};

const start = async (): Promise<void> => {
  const env = loadEnv();
  const app = buildServer();
  try {
    await app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
    logger.info({ event: "service_started", nodeEnv: env.nodeEnv });
  } catch (error) {
    logger.error({
      event: "service_start_failed",
      message: error instanceof Error ? error.message : "unknown error"
    });
    process.exit(1);
  }
};

void start();
