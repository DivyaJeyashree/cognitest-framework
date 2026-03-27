"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDriver = void 0;
const playwright_1 = require("playwright");
class ApiDriver {
    async startSession(baseURL) {
        return playwright_1.request.newContext({ baseURL, ignoreHTTPSErrors: true });
    }
    async stopSession(context) {
        await context.dispose();
    }
}
exports.ApiDriver = ApiDriver;
