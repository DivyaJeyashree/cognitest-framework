"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthClient = void 0;
class HealthClient {
    client;
    constructor(client) {
        this.client = client;
    }
    async getHealth() {
        return this.client.get("/posts/1");
    }
}
exports.HealthClient = HealthClient;
