/**
 * Trial Data Cleaner Component
 *
 * Automatically clears trial mode data when user signs in
 * Runs once per session using useEffect
 */

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { clearAllTrialData } from "@/app/(frontend)/core/utils/trialMode";

export default function TrialDataCleaner() {
  const { data: session, status } = useSession();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Only run once when user is authenticated
    if (status === "authenticated" && session?.user && !hasCleared.current) {
      hasCleared.current = true;

      // Clear trial data in background
      clearAllTrialData()
        .then(() => {
          console.log("[TrialDataCleaner] Successfully cleared trial data");
        })
        .catch((error) => {
          console.error("[TrialDataCleaner] Error clearing trial data:", error);
        });
    }
  }, [status, session]);

  // This component doesn't render anything
  return null;
}
