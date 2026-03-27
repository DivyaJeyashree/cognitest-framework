export interface MobileCapability {
  platformName: string;
  "appium:automationName": string;
  "appium:deviceName": string;
  "appium:platformVersion": string;
  "appium:appPackage"?: string;
  "appium:appActivity"?: string;
}

const capabilitiesByEnv: Record<string, MobileCapability> = {
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

export const getMobileCapabilities = (env: string): MobileCapability =>
  capabilitiesByEnv[env] ?? capabilitiesByEnv.local;
