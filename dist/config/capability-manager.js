"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMobileCapabilities = void 0;
const capabilitiesByEnv = {
    local: {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "Android Emulator",
        "appium:platformVersion": "14"
    },
    staging: {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "Android Emulator",
        "appium:platformVersion": "14"
    }
};
const getMobileCapabilities = (env) => capabilitiesByEnv[env] ?? capabilitiesByEnv.local;
exports.getMobileCapabilities = getMobileCapabilities;
