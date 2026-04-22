import { createApp } from "./app";
import { env } from "./config/env";

export const app = createApp();

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`[INFO] Server is running on http://localhost:${env.port}`);
  });
}

export default app;
