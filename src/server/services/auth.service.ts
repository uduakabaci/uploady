import { and, eq, gt, isNull } from "drizzle-orm";
import { ID_PREFIXES } from "../../shared/constants";
import type { AuthSession, AuthUser } from "../../shared/types";
import { environment } from "../../shared/environment";
import { CryptoUtils } from "../lib/crypto";
import { IdUtils } from "../lib/id";
import { db } from "../db";
import { magicLinks, sessions, users } from "../db/schema";
import { signAccessToken } from "../auth/token";

type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
};

type MagicLinkRequestResult = {
  email: string;
  magicLinkUrl: string;
  expiresAt: Date;
};

export namespace AuthService {
  function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  function getRequestIp(req: Request): string | null {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0]?.trim() ?? null;
    }

    return req.headers.get("x-real-ip");
  }

  function getRequestUserAgent(req: Request): string | null {
    return req.headers.get("user-agent");
  }

  function toUser(record: typeof users.$inferSelect): AuthUser {
    return {
      id: record.id,
      email: record.email,
    };
  }

  function toSession(record: typeof sessions.$inferSelect): AuthSession {
    return {
      id: record.id,
      userId: record.userId,
      refreshExpiresAt: record.refreshExpiresAt,
      revokedAt: record.revokedAt,
    };
  }

  async function issueTokenPair(userId: string, sessionId: string): Promise<AuthTokenPair> {
    const accessToken = await signAccessToken({
      sub: userId,
      sid: sessionId,
      typ: "access",
    });

    const refreshToken = CryptoUtils.createOpaqueToken();

    return {
      accessToken,
      refreshToken,
    };
  }

  export async function findUserById(userId: string): Promise<AuthUser | null> {
    const record = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return record ? toUser(record) : null;
  }

  export async function getOrCreateUserByEmail(email: string): Promise<AuthUser> {
    const normalizedEmail = normalizeEmail(email);
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existing) return toUser(existing);

    const inserted = await db
      .insert(users)
      .values({
        id: IdUtils.createPrefixedUlid(ID_PREFIXES.user),
        email: normalizedEmail,
      })
      .returning();

    return toUser(inserted[0]);
  }

  export async function requestMagicLink(email: string): Promise<MagicLinkRequestResult> {
    const user = await getOrCreateUserByEmail(email);
    const token = CryptoUtils.createOpaqueToken();
    const tokenHash = await CryptoUtils.sha256Hex(token);
    const expiresAt = new Date(Date.now() + environment.auth.magicLinkTtlSeconds * 1000);

    await db.insert(magicLinks).values({
      id: IdUtils.createPrefixedUlid(ID_PREFIXES.magicLink),
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const magicLinkUrl = `${environment.appBaseUrl}/auth/verify?token=${encodeURIComponent(token)}`;

    return {
      email: user.email,
      magicLinkUrl,
      expiresAt,
    };
  }

  export async function verifyMagicLinkToken(token: string): Promise<AuthUser | null> {
    const tokenHash = await CryptoUtils.sha256Hex(token);
    const record = await db.query.magicLinks.findFirst({
      where: and(
        eq(magicLinks.tokenHash, tokenHash),
        isNull(magicLinks.consumedAt),
        gt(magicLinks.expiresAt, new Date()),
      ),
    });

    if (!record) return null;

    await db
      .update(magicLinks)
      .set({ consumedAt: new Date(), updatedAt: new Date() })
      .where(eq(magicLinks.id, record.id));

    const user = await findUserById(record.userId);
    return user;
  }

  export async function createSessionForUser(userId: string, req: Request) {
    const sessionId = IdUtils.createPrefixedUlid(ID_PREFIXES.session);
    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + environment.auth.accessTokenTtlSeconds * 1000);
    const refreshExpiresAt = new Date(now.getTime() + environment.auth.refreshTokenTtlSeconds * 1000);
    const { accessToken, refreshToken } = await issueTokenPair(userId, sessionId);
    const refreshTokenHash = await CryptoUtils.sha256Hex(refreshToken);

    const inserted = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        refreshTokenHash,
        refreshExpiresAt,
        accessExpiresAt,
        ip: getRequestIp(req),
        userAgent: getRequestUserAgent(req),
      })
      .returning();

    return {
      session: toSession(inserted[0]),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  export async function resolveSessionForAccess(userId: string, sessionId: string): Promise<AuthSession | null> {
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId),
        isNull(sessions.revokedAt),
        gt(sessions.refreshExpiresAt, new Date()),
      ),
    });

    return session ? toSession(session) : null;
  }

  export async function refreshSessionFromToken(refreshToken: string, req: Request) {
    const refreshTokenHash = await CryptoUtils.sha256Hex(refreshToken);
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.refreshTokenHash, refreshTokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.refreshExpiresAt, new Date()),
      ),
    });

    if (!session) return null;

    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + environment.auth.accessTokenTtlSeconds * 1000);
    const refreshExpiresAt = new Date(now.getTime() + environment.auth.refreshTokenTtlSeconds * 1000);
    const { accessToken, refreshToken: rotatedRefreshToken } = await issueTokenPair(session.userId, session.id);
    const rotatedRefreshTokenHash = await CryptoUtils.sha256Hex(rotatedRefreshToken);

    await db
      .update(sessions)
      .set({
        refreshTokenHash: rotatedRefreshTokenHash,
        refreshExpiresAt,
        accessExpiresAt,
        lastUsedAt: now,
        updatedAt: now,
        ip: getRequestIp(req),
        userAgent: getRequestUserAgent(req),
      })
      .where(eq(sessions.id, session.id));

    const user = await findUserById(session.userId);
    if (!user) return null;

    return {
      user,
      session: {
        id: session.id,
        userId: session.userId,
        refreshExpiresAt,
        revokedAt: null,
      } satisfies AuthSession,
      tokens: {
        accessToken,
        refreshToken: rotatedRefreshToken,
      },
    };
  }

  export async function revokeSession(sessionId: string): Promise<void> {
    await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));
  }

  export async function revokeSessionForUser(sessionId: string, userId: string): Promise<void> {
    await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
  }

  export async function revokeAllSessionsForUser(userId: string): Promise<void> {
    await db
      .update(sessions)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
  }

  export async function listActiveSessionsForUser(userId: string): Promise<AuthSession[]> {
    const records = await db.query.sessions.findMany({
      where: and(eq(sessions.userId, userId), isNull(sessions.revokedAt), gt(sessions.refreshExpiresAt, new Date())),
    });

    return records.map(toSession);
  }
}
