# uploady.app

uploady.app is a Bun + React scaffold for an upload/share product, with tRPC APIs and PostgreSQL via Drizzle.

Development uses local Docker infrastructure with fixed `47xx` host ports to avoid conflicts with other projects.

## Current Scope

- tRPC endpoint at `/trpc/*`
- Magic-link authentication foundation
- Session-based auth with access + refresh tokens
- Drizzle ORM wired to PostgreSQL
- Drizzle Studio and migration workflow enabled

## Run

Install dependencies:

```bash
bun install
```

Start development server:

```bash
bun run dev
```

## Local Infrastructure (Docker)

Bring up Postgres + Redis + MinIO:

```bash
bun run infra:up
```

Stop infra:

```bash
bun run infra:down
```

Tail infra logs:

```bash
bun run infra:logs
```

Port map:

- App: `4700`
- Postgres: `4701` (container `5432`)
- Redis: `4702` (container `6379`)
- MinIO API: `4703` (container `9000`)
- MinIO Console: `4704` (container `9001`)

MinIO bucket is created by `minio-init` and remains **private by default**.

Build:

```bash
bun run build
```

## Database (Drizzle + PostgreSQL)

Generate migration files:

```bash
bun run db:generate
```

Apply migrations:

```bash
bun run db:migrate
```

Open Drizzle Studio:

```bash
bun run db:studio
```

## Environment

Environment is centralized in `src/shared/environment.ts`.

Active variables:

- `NODE_ENV`
- `PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_BIND_PORT`
- `REDIS_BIND_PORT`
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`
- `MINIO_BUCKET_NAME`
- `MINIO_BIND_PORT`
- `MINIO_CONSOLE_PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`
- `AUTH_JWT_SECRET`
- `AUTH_ACCESS_TOKEN_TTL_SECONDS`
- `AUTH_REFRESH_TOKEN_TTL_SECONDS`
- `AUTH_MAGIC_LINK_TTL_SECONDS`
- `APP_BASE_URL`

See `.env.example` for defaults and placeholders.

## Authentication Flow

- `auth.requestMagicLink(email)`
  - creates/gets user
  - creates one-time magic token (hashed in DB)
  - currently logs the magic URL on server for development
- `auth.verifyMagicLink(token)`
  - verifies and consumes magic token
  - creates a new session
  - returns access token
  - sets refresh token as `HttpOnly` cookie
- `auth.refresh()`
  - reads refresh token from cookie
  - rotates refresh token and session state
  - returns new access token and updates refresh cookie
- `auth.me()`
  - protected; returns current user + session info

Protected routes require:

```text
Authorization: Bearer <access_token>
```

## ID and Timestamp Conventions

- User IDs use prefixed ULIDs: `usr_<ulid>`
- Magic links: `mlk_<ulid>`
- Sessions: `ses_<ulid>`
- Tables use `created_at` and `updated_at`
- Session/magic-link validity uses explicit expiry timestamps

## Tables

- `users`
- `magic_links`
- `sessions`

## Structure

```text
src/
├── index.tsx
├── shared/
│   ├── constants.ts
│   ├── environment.ts
│   └── types.ts
├── server/
│   ├── app.ts
│   ├── auth/
│   │   └── token.ts
│   ├── db/
│   │   ├── client.ts
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── lib/
│   │   ├── cookie.ts
│   │   ├── crypto.ts
│   │   ├── id.ts
│   │   └── time.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── file.service.ts
│   │   ├── share.service.ts
│   │   └── storage.service.ts
│   ├── trpc/
│   │   ├── context.ts
│   │   ├── trpc.ts
│   │   ├── router.ts
│   │   └── routers/
│   │       ├── auth.router.ts
│   │       ├── files.router.ts
│   │       ├── health.router.ts
│   │       └── share.router.ts
│   └── types/
│       └── route-map.ts
└── frontend/
    ├── index.html
    ├── main.tsx
    ├── routes.tsx
    ├── trpc/
    │   ├── client.ts
    │   └── provider.tsx
    ├── layouts/
    │   └── layout.tsx
    ├── pages/
    │   ├── home.tsx
    │   └── not-found.tsx
    ├── components/
    │   └── health-card.tsx
    └── styles/
        └── index.css
```
