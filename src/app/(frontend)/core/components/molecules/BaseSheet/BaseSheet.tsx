"use client";

import * as React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../atoms/Sheet/Sheet";
import { cn } from "@/app/(frontend)/core/utils/utils";

interface BaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

/**
 * BaseSheet component
 * Features:
 * - Full height from navbar bottom to screen bottom
 * - No border radius
 * - Flush with right and bottom edges
 * - Customizable side positioning
 */
export default function BaseSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  className,
}: BaseSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side={side}
        className={cn(
          // Full height touching bottom, positioned below navbar
          "flex h-[calc(100vh-73px)] flex-col border-l shadow-xl",
          "bottom-0 top-[73px]",
          // Width adjustments based on side
          side === "right" && "w-full sm:max-w-[500px]",
          side === "left" && "w-full sm:max-w-[500px]",
          side === "top" && "h-[calc(50vh)]",
          side === "bottom" && "h-[calc(50vh)]",
          className,
        )}
      >
        {title && (
          <SheetHeader className="flex-shrink-0 bg-muted/50 px-6 py-4">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}

        <div className="scrollbar-clean flex-1 overflow-y-auto px-6 py-0">
          {children}
        </div>

        {footer && (
          <SheetFooter className="flex-shrink-0 bg-none px-6 py-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Re-export for convenience
export { SheetClose };
