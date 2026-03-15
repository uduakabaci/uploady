import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { TimeUtils } from "@/server/lib/time";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    createdAt: TimeUtils.createdAtColumn(),
    updatedAt: TimeUtils.updatedAtColumn(),
  },
  table => [uniqueIndex("users_email_unique").on(table.email)],
);

export const magicLinks = pgTable(
  "magic_links",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    consumedAt: TimeUtils.nullableTimestampColumn("consumed_at"),
    createdAt: TimeUtils.createdAtColumn(),
    updatedAt: TimeUtils.updatedAtColumn(),
  },
  table => [
    uniqueIndex("magic_links_token_hash_unique").on(table.tokenHash),
    index("magic_links_user_id_idx").on(table.userId),
    index("magic_links_expires_at_idx").on(table.expiresAt),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    refreshExpiresAt: timestamp("refresh_expires_at", { withTimezone: true, mode: "date" }).notNull(),
    accessExpiresAt: timestamp("access_expires_at", { withTimezone: true, mode: "date" }).notNull(),
    lastUsedAt: TimeUtils.nullableTimestampColumn("last_used_at"),
    revokedAt: TimeUtils.nullableTimestampColumn("revoked_at"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: TimeUtils.createdAtColumn(),
    updatedAt: TimeUtils.updatedAtColumn(),
  },
  table => [
    uniqueIndex("sessions_refresh_token_hash_unique").on(table.refreshTokenHash),
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_refresh_expires_at_idx").on(table.refreshExpiresAt),
  ],
);
