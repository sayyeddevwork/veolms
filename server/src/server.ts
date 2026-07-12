import { config } from "./config/index.js";
import app from "./app.js";

let server: ReturnType<typeof app.listen>;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    server = app.listen(config.PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
