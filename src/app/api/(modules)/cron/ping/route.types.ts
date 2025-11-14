import { z } from "zod";

/**
 * Response schema for Pinecone stats
 */
export const PineconeStatsSchema = z.object({
  totalVectorCount: z.number(),
  dimension: z.number(),
});

/**
 * Response schema for MongoDB stats
 */
export const MongoDBStatsSchema = z.object({
  userCount: z.number(),
  noteCount: z.number(),
});

/**
 * Response schema for ping endpoint
 */
export const PingResponseSchema = z.object({
  success: z.boolean(),
  pinecone: z.object({
    success: z.boolean(),
    stats: PineconeStatsSchema.optional(),
    error: z.string().optional(),
  }),
  mongodb: z.object({
    success: z.boolean(),
    stats: MongoDBStatsSchema.optional(),
    error: z.string().optional(),
  }),
  duration: z.string().optional(),
  timestamp: z.string().optional(),
});

export type PineconeStats = z.infer<typeof PineconeStatsSchema>;
export type MongoDBStats = z.infer<typeof MongoDBStatsSchema>;
export type PingResponse = z.infer<typeof PingResponseSchema>;
