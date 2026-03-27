import { remote, type Browser } from "webdriverio";
import { getMobileCapabilities } from "../../config/capability-manager";

export class MobileDriver {
  async startSession(env: string): Promise<Browser> {
    const capabilities = getMobileCapabilities(env);
    return remote({
      hostname: process.env.APPIUM_HOST ?? "127.0.0.1",
      port: Number(process.env.APPIUM_PORT ?? "4723"),
      path: process.env.APPIUM_PATH ?? "/wd/hub",
      capabilities
    });
  }

  async stopSession(driver: Browser): Promise<void> {
    await driver.deleteSession();
  }
}
