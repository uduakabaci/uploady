import { jwtVerify, SignJWT } from "jose";
import { environment } from "../../shared/environment";

const encoder = new TextEncoder();

type AccessTokenClaims = {
  sub: string;
  sid: string;
  typ: "access";
};

type TokenPayload = {
  sub?: string;
  sid?: string;
  typ?: string;
};

export function extractBearerToken(req: Request): string | null {
  const authorization = req.headers.get("authorization");
  if (!authorization) return null;

  const [scheme, token] = authorization.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;

  const cleanedToken = token.trim();
  return cleanedToken.length > 0 ? cleanedToken : null;
}

export async function signAccessToken(claims: AccessTokenClaims): Promise<string> {
  const ttl = environment.auth.accessTokenTtlSeconds;

  return new SignJWT({ sid: claims.sid, typ: claims.typ })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(encoder.encode(environment.auth.jwtSecret));
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(environment.auth.jwtSecret), {
      algorithms: ["HS256"],
    });

    const parsed = payload as TokenPayload;

    if (!parsed.sub || !parsed.sid || parsed.typ !== "access") {
      return null;
    }

    return {
      sub: parsed.sub,
      sid: parsed.sid,
      typ: "access",
    };
  } catch {
    return null;
  }
}
