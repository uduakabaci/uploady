import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { extractBearerToken, verifyAccessToken } from "@/server/auth/token";
import { AuthService } from "@/server/services/auth.service";
import type { AuthSession, AuthUser } from "@/shared/types";

type Context = {
  req: Request;
  responseHeaders: Headers;
  user: AuthUser | null;
  session: AuthSession | null;
};

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const responseHeaders = new Headers();
  const token = extractBearerToken(opts.req);
  const claims = token ? await verifyAccessToken(token) : null;

  if (!claims) {
    return {
      req: opts.req,
      responseHeaders,
      user: null,
      session: null,
    };
  }

  const session = await AuthService.resolveSessionForAccess(claims.sub, claims.sid);
  if (!session) {
    return {
      req: opts.req,
      responseHeaders,
      user: null,
      session: null,
    };
  }

  const user = await AuthService.findUserById(claims.sub);
  if (!user) {
    return {
      req: opts.req,
      responseHeaders,
      user: null,
      session: null,
    };
  }

  return {
    req: opts.req,
    responseHeaders,
    user,
    session,
  };
}

export type TRPCContext = Context;
