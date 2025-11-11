import { z } from "zod";

/**
 * Response schema for cron job execution
 */
export const CronResponseSchema = z.object({
  success: z.boolean(),
  updated: z.number().optional(),
  error: z.string().optional(),
});

export type CronResponse = z.infer<typeof CronResponseSchema>;
