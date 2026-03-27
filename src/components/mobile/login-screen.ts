import type { Browser } from "webdriverio";

export class LoginScreen {
  constructor(private readonly driver: Browser) {}

  async login(username: string, password: string): Promise<void> {
    const usernameField = await this.driver.$("~username");
    const passwordField = await this.driver.$("~password");
    const loginButton = await this.driver.$("~login");
    await usernameField.setValue(username);
    await passwordField.setValue(password);
    await loginButton.click();
  }
}
