/**
 * Google Analytics Utility
 * Handles GA4 tracking and event logging
 */
import { config } from "@/app/(frontend)/core/config";

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = config.analytics.gaId;

// Check if GA is available
export const isGAEnabled = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

// Page view tracking
export const gtagPageview = (url: string) => {
  if (!isGAEnabled()) return;

  window.gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
};

// Generic event tracking
export const gtagEvent = (action: string, params?: Record<string, any>) => {
  if (!isGAEnabled()) return;

  window.gtag("event", action, params);
};

// Specific event helpers
export const trackSignUp = (method: string = "email"): void => {
  gtagEvent("sign_up", {
    method,
  });
};

export const trackSignIn = (method: string = "email"): void => {
  gtagEvent("login", {
    method,
  });
};

export const trackNoteCreated = (isTrialMode: boolean = false): void => {
  gtagEvent("create_note", {
    category: "notes",
    label: isTrialMode ? "trial" : "authenticated",
  });
};

export const trackNoteDeleted = (isTrialMode: boolean = false): void => {
  gtagEvent("delete_note", {
    category: "notes",
    label: isTrialMode ? "trial" : "authenticated",
  });
};

export const trackChatMessage = (isTrialMode: boolean = false): void => {
  gtagEvent("send_message", {
    category: "chat",
    label: isTrialMode ? "trial" : "authenticated",
  });
};

export const trackTrialLimitReached = (limitType: "notes" | "chat"): void => {
  gtagEvent("trial_limit_reached", {
    category: "trial",
    limit_type: limitType,
  });
};
