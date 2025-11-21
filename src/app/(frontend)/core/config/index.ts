/**
 * Frontend Configuration
 * Centralizes all environment variables and frontend-specific config
 * Note: process.env is used for Next.js with NEXT_PUBLIC_ prefix
 */

// Environment detection helpers
const getEnvironment = (): string => {
  if (typeof process === "undefined") return "development";
  return process.env.NODE_ENV || "development";
};

// Application configuration
export const config = {
  // API configuration
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),
  },

  // Analytics configuration
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },

  // Authentication configuration
  auth: {
    tokenKey: "auth_token",
    refreshTokenKey: "refresh_token",
    tokenExpiry: 60 * 60 * 1000, // 1 hour in milliseconds
    nextAuthUrl:
      process.env.NEXT_PUBLIC_NEXTAUTH_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000",
  },

  // Application metadata
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "AI Note",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    description: "AI-powered note-taking app",
    environment: getEnvironment(),
  },

  // Feature flags
  features: {
    enableAnalytics: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    enableDevtools: getEnvironment() === "development",
    enableI18n: true,
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },

  // File upload configuration
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxFiles: 10,
  },

  // Theme configuration
  theme: {
    defaultTheme: "system" as const,
    storageKey: "theme-preference",
  },

  // Internationalization
  i18n: {
    defaultLocale: "en",
    supportedLocales: ["en", "vi"],
    fallbackLocale: "en",
  },

  // Development configuration
  dev: {
    enableLogger: getEnvironment() === "development",
    enableReduxDevtools: getEnvironment() === "development",
  },
} as const;

// Environment helpers
export const isDevelopment = config.app.environment === "development";
export const isProduction = config.app.environment === "production";
export const isStaging = config.app.environment === "staging";

// Type exports
export type Config = typeof config;
export type Environment = typeof config.app.environment;
export type SupportedLocale = (typeof config.i18n.supportedLocales)[number];
