import { z } from "zod";
import { publicProcedure, router } from "@/server/trpc/trpc";
import { APP_NAME } from "@/shared/constants";

const healthInputSchema = z
  .object({
    checkStorage: z.boolean().optional(),
  })
  .strict()
  .optional();

export const healthRouter = router({
  status: publicProcedure.input(healthInputSchema).query(() => {
    return {
      status: "ok" as const,
      service: APP_NAME,
      timestamp: new Date().toISOString(),
    };
  }),
});
