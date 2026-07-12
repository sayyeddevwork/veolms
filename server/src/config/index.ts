import { validateEnv } from "./validate-env.js";
import { buildAppConfig } from "./app.config.js";

const env = validateEnv();
const appConfig = buildAppConfig(env);

export const config = {
  ...env,
  app: appConfig,
};

export type Config = typeof config;
