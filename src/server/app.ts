import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { RouteMap } from "./types/route-map";
import { createTRPCContext } from "./trpc/context";
import { appRouter } from "./trpc/router";

export function createServerRoutes(): RouteMap {
  return {
    "/trpc/*": req => {
      return fetchRequestHandler({
        endpoint: "/trpc",
        req,
        router: appRouter,
        createContext: createTRPCContext,
        responseMeta(opts) {
          if (!opts.ctx) return {};
          return {
            headers: opts.ctx.responseHeaders,
          };
        },
      });
    },
  };
}

export function createServer() {
  return {
    routes: createServerRoutes(),
  };
}
