import { z } from "zod";

/**
 * Response schema for Pinecone ping endpoint
 */
export const PineconeStatsSchema = z.object({
  totalVectorCount: z.number(),
  dimension: z.number(),
});

export const PinecongPingResponseSchema = z.object({
  success: z.boolean(),
  stats: PineconeStatsSchema.optional(),
  error: z.string().optional(),
});

export type PineconeStats = z.infer<typeof PineconeStatsSchema>;
export type PinecongPingResponse = z.infer<typeof PinecongPingResponseSchema>;
