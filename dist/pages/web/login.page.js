"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const login_locators_1 = require("../../locators/web/login.locators");
const env_1 = require("../../config/env");
class LoginPage {
    page;
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(env_1.BASE_URL);
    }
    async login(username, password) {
        await this.page.waitForLoadState('networkidle');
        const usernameField = this.page.locator("input[placeholder='Username'], input[name='username']");
        await usernameField.waitFor({ state: 'visible', timeout: 20000 });
        await usernameField.fill(username);
        const passwordField = this.page.locator("input[placeholder='Password'], input[type='password']");
        await passwordField.fill(password);
        await this.page.screenshot({ path: 'reports/before-login.png' });
        await this.page.locator(login_locators_1.LoginLocators.LOGIN_BTN).click();
    }
    async getToasterMessage() {
        await this.page.waitForSelector(login_locators_1.LoginLocators.TOASTER);
        return await this.page.locator(login_locators_1.LoginLocators.TOASTER).innerText();
    }
    async getDashboardMessage() {
        await this.page.waitForSelector(login_locators_1.LoginLocators.DASHBOARD_MSG);
        return await this.page.locator(login_locators_1.LoginLocators.DASHBOARD_MSG).innerText();
    }
}
exports.LoginPage = LoginPage;
