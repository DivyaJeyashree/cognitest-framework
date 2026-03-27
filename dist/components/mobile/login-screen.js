"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginScreen = void 0;
class LoginScreen {
    driver;
    constructor(driver) {
        this.driver = driver;
    }
    async login(username, password) {
        const usernameField = await this.driver.$("~username");
        const passwordField = await this.driver.$("~password");
        const loginButton = await this.driver.$("~login");
        await usernameField.setValue(username);
        await passwordField.setValue(password);
        await loginButton.click();
    }
}
exports.LoginScreen = LoginScreen;
