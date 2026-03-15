import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createSetCookie, parseCookieHeader } from "@/server/lib/cookie";
import { AuthService } from "@/server/services/auth.service";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc/trpc";
import { COOKIE_NAMES } from "@/shared/constants";
import { environment } from "@/shared/environment";

const requestMagicLinkInputSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

const verifyMagicLinkInputSchema = z
  .object({
    token: z.string().min(1),
  })
  .strict();

const revokeSessionInputSchema = z
  .object({
    sessionId: z.string().min(1),
  })
  .strict();

function setRefreshTokenCookie(ctxHeaders: Headers, token: string) {
  const cookie = createSetCookie(COOKIE_NAMES.refreshToken, token, {
    httpOnly: true,
    secure: environment.isProduction,
    sameSite: "Lax",
    path: "/trpc",
    maxAge: environment.auth.refreshTokenTtlSeconds,
  });

  ctxHeaders.append("set-cookie", cookie);
}

function clearRefreshTokenCookie(ctxHeaders: Headers) {
  const cookie = createSetCookie(COOKIE_NAMES.refreshToken, "", {
    httpOnly: true,
    secure: environment.isProduction,
    sameSite: "Lax",
    path: "/trpc",
    maxAge: 0,
  });

  ctxHeaders.append("set-cookie", cookie);
}

function getRefreshTokenFromRequest(req: Request): string | null {
  const cookies = parseCookieHeader(req.headers.get("cookie"));
  const value = cookies[COOKIE_NAMES.refreshToken];
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const authRouter = router({
  requestMagicLink: publicProcedure.input(requestMagicLinkInputSchema).mutation(async ({ input }) => {
    const result = await AuthService.requestMagicLink(input.email);

    console.log(
      `[auth] magic link for ${result.email}: ${result.magicLinkUrl} (expires ${result.expiresAt.toISOString()})`,
    );

    return {
      ok: true as const,
      message: "If an account exists for that email, a magic link has been sent.",
    };
  }),

  verifyMagicLink: publicProcedure.input(verifyMagicLinkInputSchema).mutation(async ({ input, ctx }) => {
    const user = await AuthService.verifyMagicLinkToken(input.token);

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Magic link is invalid or expired",
      });
    }

    const { session, tokens } = await AuthService.createSessionForUser(user.id, ctx.req);
    setRefreshTokenCookie(ctx.responseHeaders, tokens.refreshToken);

    return {
      user,
      session,
      accessToken: tokens.accessToken,
    };
  }),

  refresh: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = getRefreshTokenFromRequest(ctx.req);
    if (!refreshToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Refresh token is missing",
      });
    }

    const refreshed = await AuthService.refreshSessionFromToken(refreshToken, ctx.req);
    if (!refreshed) {
      clearRefreshTokenCookie(ctx.responseHeaders);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Refresh token is invalid or expired",
      });
    }

    setRefreshTokenCookie(ctx.responseHeaders, refreshed.tokens.refreshToken);

    return {
      user: refreshed.user,
      session: refreshed.session,
      accessToken: refreshed.tokens.accessToken,
    };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      sessionId: ctx.session.id,
    };
  }),

  listSessions: protectedProcedure.query(async ({ ctx }) => {
    const activeSessions = await AuthService.listActiveSessionsForUser(ctx.user.id);
    return {
      sessions: activeSessions,
    };
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await AuthService.revokeSession(ctx.session.id);
    clearRefreshTokenCookie(ctx.responseHeaders);

    return {
      ok: true as const,
    };
  }),

  logoutSession: protectedProcedure.input(revokeSessionInputSchema).mutation(async ({ input, ctx }) => {
    await AuthService.revokeSessionForUser(input.sessionId, ctx.user.id);

    if (input.sessionId === ctx.session.id) {
      clearRefreshTokenCookie(ctx.responseHeaders);
    }

    return {
      ok: true as const,
    };
  }),

  logoutAll: protectedProcedure.mutation(async ({ ctx }) => {
    await AuthService.revokeAllSessionsForUser(ctx.user.id);
    clearRefreshTokenCookie(ctx.responseHeaders);

    return {
      ok: true as const,
    };
  }),
});
