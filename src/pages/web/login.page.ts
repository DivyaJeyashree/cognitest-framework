import { Page } from '@playwright/test';
import { LoginLocators } from '../../locators/web/login.locators';
import { BASE_URL } from '../../config/env';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate(baseUrl?: string) {
  await this.page.goto(baseUrl || BASE_URL);
}

  async login(username: string, password: string) {
    await this.page.waitForLoadState('networkidle');

    const usernameField = this.page.locator(
      "input[placeholder='Username'], input[name='username']"
    );
    await usernameField.waitFor({ state: 'visible', timeout: 20000 });
    await usernameField.fill(username);

    const passwordField = this.page.locator(
      "input[placeholder='Password'], input[type='password']"
    );
    await passwordField.fill(password);

    await this.page.screenshot({ path: 'reports/before-login.png' });
    await this.page.locator(LoginLocators.LOGIN_BTN).click();
  }

  async getToasterMessage(): Promise<string> {
    await this.page.waitForSelector(LoginLocators.TOASTER);
    return await this.page.locator(LoginLocators.TOASTER).innerText();
  }

  async getDashboardMessage(): Promise<string> {
    await this.page.waitForSelector(LoginLocators.DASHBOARD_MSG);
    return await this.page.locator(LoginLocators.DASHBOARD_MSG).innerText();
  }
}