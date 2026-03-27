"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileDriver = void 0;
const webdriverio_1 = require("webdriverio");
const capability_manager_1 = require("../../config/capability-manager");
class MobileDriver {
    async startSession(env) {
        const capabilities = (0, capability_manager_1.getMobileCapabilities)(env);
        return (0, webdriverio_1.remote)({
            hostname: process.env.APPIUM_HOST ?? "127.0.0.1",
            port: Number(process.env.APPIUM_PORT ?? "4723"),
            path: process.env.APPIUM_PATH ?? "/wd/hub",
            capabilities
        });
    }
    async stopSession(driver) {
        await driver.deleteSession();
    }
}
exports.MobileDriver = MobileDriver;
