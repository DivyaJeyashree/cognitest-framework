"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smokeApiTest = void 0;
const health_client_1 = require("../../components/api/health-client");
exports.smokeApiTest = {
    id: "API-001",
    name: "Public API health validation",
    suite: "smoke",
    platform: "api",
    tags: ["checkout", "smoke"],
    run: async ({ apiContext }) => {
        if (!apiContext) {
            throw new Error("API context missing");
        }
        const client = new health_client_1.HealthClient(apiContext);
        const response = await client.getHealth();
        if (!response.ok()) {
            throw new Error(`Health endpoint failed with status ${response.status()}`);
        }
        const body = (await response.json());
        if (body.id !== 1) {
            throw new Error("Unexpected health payload");
        }
    }
};
