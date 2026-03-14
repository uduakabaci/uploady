import { z } from "zod";

const environmentSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().url(),
    AUTH_JWT_SECRET: z.string().min(1).default("dev-jwt-secret-change-me"),
    AUTH_ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
    AUTH_REFRESH_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(2_592_000),
    AUTH_MAGIC_LINK_TTL_SECONDS: z.coerce.number().int().positive().default(900),
    APP_BASE_URL: z.string().url().default("http://localhost:3000"),

    S3_ENDPOINT: z.string().url(),
    S3_REGION: z.string().min(1).default("auto"),
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),

    // Future auth variables:
    // AUTH_JWT_ISSUER: z.string().min(1),
    // AUTH_JWT_AUDIENCE: z.string().min(1),

    // Future S3-compatible storage variables:
    // S3_PUBLIC_BASE_URL: z.string().url(),
  })
  .strict();

const parsedEnvironment = environmentSchema.safeParse({
  PORT: Bun.env.PORT,
  NODE_ENV: Bun.env.NODE_ENV,
  DATABASE_URL: Bun.env.DATABASE_URL,
  REDIS_URL: Bun.env.REDIS_URL,
  AUTH_JWT_SECRET: Bun.env.AUTH_JWT_SECRET,
  AUTH_ACCESS_TOKEN_TTL_SECONDS: Bun.env.AUTH_ACCESS_TOKEN_TTL_SECONDS,
  AUTH_REFRESH_TOKEN_TTL_SECONDS: Bun.env.AUTH_REFRESH_TOKEN_TTL_SECONDS,
  AUTH_MAGIC_LINK_TTL_SECONDS: Bun.env.AUTH_MAGIC_LINK_TTL_SECONDS,
  APP_BASE_URL: Bun.env.APP_BASE_URL,
  S3_ENDPOINT: Bun.env.S3_ENDPOINT,
  S3_REGION: Bun.env.S3_REGION,
  S3_BUCKET: Bun.env.S3_BUCKET,
  S3_ACCESS_KEY_ID: Bun.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: Bun.env.S3_SECRET_ACCESS_KEY,
  S3_FORCE_PATH_STYLE: Bun.env.S3_FORCE_PATH_STYLE,
});

if (!parsedEnvironment.success) {
  const issues = parsedEnvironment.error.issues
    .map(issue => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${issues}`);
}

const data = parsedEnvironment.data;

export const environment = {
  port: data.PORT,
  environment: data.NODE_ENV,
  isDevelopment: data.NODE_ENV === "development",
  isProduction: data.NODE_ENV === "production",
  appBaseUrl: data.APP_BASE_URL,
  database: {
    url: data.DATABASE_URL,
  },
  redis: {
    url: data.REDIS_URL,
  },
  storage: {
    endpoint: data.S3_ENDPOINT,
    region: data.S3_REGION,
    bucket: data.S3_BUCKET,
    accessKeyId: data.S3_ACCESS_KEY_ID,
    secretAccessKey: data.S3_SECRET_ACCESS_KEY,
    forcePathStyle: data.S3_FORCE_PATH_STYLE,
  },
  auth: {
    jwtSecret: data.AUTH_JWT_SECRET,
    accessTokenTtlSeconds: data.AUTH_ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlSeconds: data.AUTH_REFRESH_TOKEN_TTL_SECONDS,
    magicLinkTtlSeconds: data.AUTH_MAGIC_LINK_TTL_SECONDS,
  },
} as const;
