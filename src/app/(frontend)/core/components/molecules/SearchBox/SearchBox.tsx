"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "../../atoms/Input/Input";
import { cn } from "@/app/(frontend)/core/utils/utils";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchBoxProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with external value only when it actually changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange callback - exclude onChange from dependencies to prevent loop
  useEffect(() => {
    // Only call onChange if localValue is different from external value
    if (localValue === value) return;

    const handler = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, debounceMs]); // Intentionally exclude onChange to prevent infinite loop

  const handleClear = () => {
    setLocalValue("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={18}
      />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          type="button"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
