"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const loadEnv = () => {
    dotenv_1.default.config();
    return {
        nodeEnv: process.env.NODE_ENV ?? "development",
        logLevel: process.env.LOG_LEVEL ?? "info",
        jiraBaseUrl: process.env.JIRA_BASE_URL,
        adoBaseUrl: process.env.ADO_BASE_URL,
        postgresUrl: process.env.POSTGRES_URL
    };
};
exports.loadEnv = loadEnv;
