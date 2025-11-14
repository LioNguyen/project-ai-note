"use client";

/**
 * LoadingIndicator Component
 * Displays animated dots for loading states in chat
 */
export default function LoadingIndicator() {
  return (
    <div className="flex gap-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
    </div>
  );
}
