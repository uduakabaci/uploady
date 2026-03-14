import { authRouter } from "./routers/auth.router";
import { router } from "./trpc";
import { filesRouter } from "./routers/files.router";
import { healthRouter } from "./routers/health.router";
import { shareRouter } from "./routers/share.router";

export const appRouter = router({
  auth: authRouter,
  health: healthRouter,
  files: filesRouter,
  share: shareRouter,
});

export type AppRouter = typeof appRouter;
