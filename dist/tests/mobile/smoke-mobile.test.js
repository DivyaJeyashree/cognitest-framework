"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smokeMobileTest = void 0;
const base_test_1 = require("../../core/base-test");
exports.smokeMobileTest = {
    id: "MOB-001",
    name: "Mobile login smoke validation",
    suite: "smoke",
    platform: "mobile",
    tags: ["login", "mobile"],
    run: async ({ mobileDriver }) => {
        if (process.env.MOBILE_ENABLED !== "true") {
            throw new base_test_1.SkipTestError("Mobile execution disabled");
        }
        if (!mobileDriver) {
            throw new Error("Mobile driver not initialized");
        }
        const currentContext = await mobileDriver.getContext();
        if (!currentContext) {
            throw new Error("Unable to read mobile context");
        }
    }
};
