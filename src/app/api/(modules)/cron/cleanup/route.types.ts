import { z } from "zod";

/**
 * Response schema for cleanup statistics
 */
export const CleanupStatsSchema = z.object({
  totalTrialNotes: z.number(),
  oldNotes: z.number(),
  recentNotes: z.number(),
  wouldDelete: z.number(),
});

/**
 * Response schema for cleanup execution (POST)
 */
export const CleanupExecutionResponseSchema = z.object({
  success: z.boolean(),
  deleted: z.number(),
  cutoffDate: z.string().optional(),
  message: z.string(),
});

/**
 * Response schema for cleanup dry run (GET)
 */
export const CleanupDryRunResponseSchema = z.object({
  success: z.boolean(),
  dryRun: z.boolean(),
  cutoffDate: z.string(),
  stats: CleanupStatsSchema,
  message: z.string(),
});

/**
 * Response schema for cleanup errors
 */
export const CleanupErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export type CleanupStats = z.infer<typeof CleanupStatsSchema>;
export type CleanupExecutionResponse = z.infer<
  typeof CleanupExecutionResponseSchema
>;
export type CleanupDryRunResponse = z.infer<typeof CleanupDryRunResponseSchema>;
export type CleanupErrorResponse = z.infer<typeof CleanupErrorResponseSchema>;
