import dotenv from "dotenv";

export interface EngineEnv {
  nodeEnv: string;
  logLevel: string;
  jiraBaseUrl?: string;
  adoBaseUrl?: string;
  postgresUrl?: string;
}

export const loadEnv = (): EngineEnv => {
  dotenv.config();
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info",
    jiraBaseUrl: process.env.JIRA_BASE_URL,
    adoBaseUrl: process.env.ADO_BASE_URL,
    postgresUrl: process.env.POSTGRES_URL
  };
};
