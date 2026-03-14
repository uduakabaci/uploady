import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const resolveShareInputSchema = z
  .object({
    token: z.string().min(1),
  })
  .strict();

export const shareRouter = router({
  resolve: publicProcedure.input(resolveShareInputSchema).query(() => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Share resolution is not implemented yet",
    });
  }),
});
