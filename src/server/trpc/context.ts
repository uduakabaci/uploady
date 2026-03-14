import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { AuthSession, AuthUser } from "../../shared/types";
import { AuthService } from "../services/auth.service";
import { extractBearerToken, verifyAccessToken } from "../auth/token";

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
