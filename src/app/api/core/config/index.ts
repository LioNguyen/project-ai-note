/**
 * Backend API Configuration
 * Centralizes all environment variables and API-specific config
 * These are server-only and should never be exposed to the client
 */

// Environment detection helpers
const getEnvironment = (): string => {
  return process.env.NODE_ENV || "development";
};

const getVercelEnvironment = (): string => {
  return process.env.VERCEL_ENV || getEnvironment();
};

// Validate required environment variables
const validateEnvVar = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// API configuration
export const config = {
  // Application metadata
  app: {
    name: "AI Note",
    version: process.env.npm_package_version || "1.0.0",
    environment: getEnvironment(),
    vercelEnv: getVercelEnvironment(),
  },

  // Authentication configuration
  auth: {
    nextAuthSecret: validateEnvVar(
      "NEXTAUTH_SECRET",
      process.env.NEXTAUTH_SECRET,
    ),
    nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
    googleClientId: validateEnvVar(
      "GOOGLE_CLIENT_ID",
      process.env.GOOGLE_CLIENT_ID,
    ),
    googleClientSecret: validateEnvVar(
      "GOOGLE_CLIENT_SECRET",
      process.env.GOOGLE_CLIENT_SECRET,
    ),
  },

  // Database configuration
  database: {
    url: validateEnvVar("DATABASE_URL", process.env.DATABASE_URL),
  },

  // AI/LLM configuration
  gemini: {
    apiKey: validateEnvVar("GEMINI_API_KEY", process.env.GEMINI_API_KEY),
    model: "text-embedding-004",
  },

  // Vector database configuration
  pinecone: {
    apiKey: validateEnvVar("PINECONE_API_KEY", process.env.PINECONE_API_KEY),
    indexName: process.env.PINECONE_INDEX_NAME || "project-note-ai",
  },

  // Vercel configuration
  vercel: {
    url: process.env.VERCEL_URL || "localhost:3000",
    projectId: process.env.VERCEL_PROJECT_ID,
    projectName: process.env.VERCEL_PROJECT_NAME,
  },

  // Development configuration
  dev: {
    enableLogger: getEnvironment() === "development",
    enableDebugAuth: getEnvironment() === "development",
    enableDetailedErrors: getEnvironment() === "development",
  },
} as const;

// Environment helpers
export const isDevelopment = config.app.environment === "development";
export const isProduction = config.app.environment === "production";
export const isStaging =
  config.app.vercelEnv === "preview" || config.app.environment === "staging";

// Type exports
export type Config = typeof config;
export type Environment = typeof config.app.environment;
