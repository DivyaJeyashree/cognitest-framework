"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefectManager = void 0;
const ado_client_1 = require("./ado-client");
const jira_client_1 = require("./jira-client");
class DefectManager {
    jiraClient;
    adoClient;
    constructor(jiraClient = new jira_client_1.JiraClient(), adoClient = new ado_client_1.AdoClient()) {
        this.jiraClient = jiraClient;
        this.adoClient = adoClient;
    }
    async createForFailure(provider, result) {
        if (result.status !== "failed" || provider === "none") {
            return undefined;
        }
        if (provider === "jira") {
            return this.jiraClient.createDefect(result);
        }
        if (provider === "ado") {
            return this.adoClient.createBug(result);
        }
        const [jiraId, adoId] = await Promise.all([
            this.jiraClient.createDefect(result),
            this.adoClient.createBug(result)
        ]);
        return `${jiraId},${adoId}`;
    }
}
exports.DefectManager = DefectManager;
