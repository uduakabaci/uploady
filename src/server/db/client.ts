import { drizzle } from "drizzle-orm/bun-sql";
import { environment } from "@/shared/environment";
import * as schema from "@/server/db/schema";

export const sql = new Bun.SQL(environment.database.url);

export const db = drizzle({
  client: sql,
  schema,
});
