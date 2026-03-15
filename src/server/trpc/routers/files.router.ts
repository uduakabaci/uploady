import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/trpc/trpc";

const listFilesInputSchema = z
  .object({
    cursor: z.string().min(1).optional(),
    limit: z.number().int().min(1).max(100).default(20),
  })
  .strict()
  .optional();

const presignUploadInputSchema = z
  .object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
    size: z.number().int().positive(),
  })
  .strict();

const completeUploadInputSchema = z
  .object({
    objectKey: z.string().min(1),
    fileName: z.string().min(1),
    contentType: z.string().min(1),
    size: z.number().int().positive(),
    etag: z.string().min(1).optional(),
  })
  .strict();

const fileByIdInputSchema = z
  .object({
    fileId: z.string().min(1),
  })
  .strict();

const createShareInputSchema = z
  .object({
    fileId: z.string().min(1),
    expiresAt: z.string().datetime().nullable().optional(),
  })
  .strict();

function notImplemented(message: string): never {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
  });
}

export const filesRouter = router({
  list: protectedProcedure.input(listFilesInputSchema).query(() => {
    return notImplemented("Listing files is not implemented yet");
  }),

  presignUpload: protectedProcedure.input(presignUploadInputSchema).mutation(() => {
    return notImplemented("Presigned upload is not implemented yet");
  }),

  completeUpload: protectedProcedure.input(completeUploadInputSchema).mutation(() => {
    return notImplemented("Complete upload is not implemented yet");
  }),

  getById: protectedProcedure.input(fileByIdInputSchema).query(() => {
    return notImplemented("File detail is not implemented yet");
  }),

  delete: protectedProcedure.input(fileByIdInputSchema).mutation(() => {
    return notImplemented("File delete is not implemented yet");
  }),

  createShare: protectedProcedure.input(createShareInputSchema).mutation(() => {
    return notImplemented("Share creation is not implemented yet");
  }),
});
