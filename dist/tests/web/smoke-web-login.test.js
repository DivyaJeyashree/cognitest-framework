"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smokeWebTest = void 0;
const login_page_1 = require("../../pages/web/login.page");
exports.smokeWebTest = {
    id: "smoke_web_login",
    name: "Smoke Web Login Test",
    suite: "smoke",
    tags: ["login", "web"],
    platform: "web",
    run: async (context) => {
        const login = new login_page_1.LoginPage(context.page);
        await login.navigate();
        await login.login("autoManuel3", "Automation@123");
        const msg = await login.getDashboardMessage();
        if (!msg.includes("Let's explore"))
            throw new Error("Dashboard message mismatch");
    },
};
