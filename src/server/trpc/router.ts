import { authRouter } from "@/server/trpc/routers/auth.router";
import { filesRouter } from "@/server/trpc/routers/files.router";
import { healthRouter } from "@/server/trpc/routers/health.router";
import { shareRouter } from "@/server/trpc/routers/share.router";
import { router } from "@/server/trpc/trpc";

export const appRouter = router({
  auth: authRouter,
  health: healthRouter,
  files: filesRouter,
  share: shareRouter,
});

export type AppRouter = typeof appRouter;
