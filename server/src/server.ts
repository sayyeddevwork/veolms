import { config } from "./config/index.js";
import app from "./app.js";
import { logger } from "./infrastructure/logging/index.js";

const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Error starting server");
    process.exit(1);
  }
};

startServer();
