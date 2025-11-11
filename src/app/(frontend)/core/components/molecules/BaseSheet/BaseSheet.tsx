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
 * BaseSheet component with floating style
 * Features:
 * - Spacing from screen edges (right, top, bottom)
 * - Border radius for a floating appearance
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
          // Floating style with spacing from edges
          "m-4 flex h-[calc(100vh-2rem)] flex-col rounded-lg border shadow-xl",
          // Width adjustments based on side
          side === "right" && "w-[calc(100%-2rem)] sm:max-w-[500px]",
          side === "left" && "w-[calc(100%-2rem)] sm:max-w-[500px]",
          side === "top" && "h-[calc(50vh-2rem)]",
          side === "bottom" && "h-[calc(50vh-2rem)]",
          className,
        )}
      >
        {title && (
          <SheetHeader className="flex-shrink-0 border-b pb-0">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}

        <div className="scrollbar-clean flex-1 overflow-y-auto py-0">
          {children}
        </div>

        {footer && (
          <SheetFooter className="flex-shrink-0 border-t pt-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Re-export for convenience
export { SheetClose };
