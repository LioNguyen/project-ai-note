import * as React from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/app/(frontend)/core/utils/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState component - Display empty state with icon, title, description, and optional action
 * Matches the app's theme and design system
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-3">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
