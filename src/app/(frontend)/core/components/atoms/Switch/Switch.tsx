"use client";

import * as React from "react";

import { cn } from "@/app/(frontend)/core/utils/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
}

/**
 * Switch component - A toggle switch for binary states
 * Custom implementation with label support
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      leftLabel,
      rightLabel,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className="flex items-center gap-2">
        {leftLabel && (
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              checked ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {leftLabel}
          </span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          data-state={checked ? "checked" : "unchecked"}
          disabled={disabled}
          className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            checked ? "bg-primary" : "bg-input",
            className,
          )}
          onClick={handleClick}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              checked ? "translate-x-5" : "translate-x-0",
            )}
          />
        </button>
        {rightLabel && (
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              checked ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {rightLabel}
          </span>
        )}
      </div>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
