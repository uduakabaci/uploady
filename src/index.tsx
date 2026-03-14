import { serve } from "bun";
import frontendIndex from "./frontend/index.html";
import { createServer } from "./server/app";
import { APP_NAME } from "./shared/constants";
import { environment } from "./shared/environment";

const { routes } = createServer();

const server = serve({
  port: environment.port,
  routes: {
    ...routes,
    "/*": frontendIndex,
  },
  development: environment.isDevelopment,
});

console.log(`Server running for ${APP_NAME} in ${environment.environment} at ${server.url}`);
