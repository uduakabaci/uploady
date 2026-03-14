import { timestamp } from "drizzle-orm/pg-core";

export namespace TimeUtils {
  const timestampOptions = {
    withTimezone: true,
    mode: "date",
  } as const;

  export function createdAtColumn(name = "created_at") {
    return timestamp(name, timestampOptions).notNull().defaultNow();
  }

  export function updatedAtColumn(name = "updated_at") {
    return timestamp(name, timestampOptions).notNull().defaultNow();
  }

  export function nullableTimestampColumn(name: string) {
    return timestamp(name, timestampOptions);
  }
}
