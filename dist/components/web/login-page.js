"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
class LoginPage {
    actions;
    constructor(actions) {
        this.actions = actions;
    }
    async login(username, password) {
        await this.actions.typeWithHealing(["#username", "[name='username']"], username);
        await this.actions.typeWithHealing(["#password", "[name='password']"], password);
        await this.actions.clickWithHealing(["button[type='submit']", "#loginBtn"]);
    }
}
exports.LoginPage = LoginPage;
