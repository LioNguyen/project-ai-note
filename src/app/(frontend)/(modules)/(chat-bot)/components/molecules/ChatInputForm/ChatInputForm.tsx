"use client";

import { Trash } from "lucide-react";
import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { Input } from "@/app/(frontend)/core/components/atoms/Input/Input";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import TrialModeIndicator from "../../atoms/TrialModeIndicator/TrialModeIndicator";

interface ChatInputFormProps {
  input: string;
  isLoading: boolean;
  isTrialMode: boolean;
  hasReachedLimit: boolean;
  remainingChats: number;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
}

/**
 * ChatInputForm Component
 * Displays the input form area with send button and trial mode indicator
 */
export default function ChatInputForm({
  input,
  isLoading,
  isTrialMode,
  hasReachedLimit,
  remainingChats,
  inputRef,
  onInputChange,
  onSubmit,
  onClear,
}: ChatInputFormProps) {
  const locale = useLocale();
  const t = locales[locale];

  return (
    <div className="rounded-b-2xl border-t border-primary/10 bg-gradient-to-t from-background to-transparent px-4 py-3">
      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex gap-1.5">
        {/* Clear Button */}
        <Button
          title={t.chat.clearChat}
          variant="outline"
          size="icon"
          className="shrink-0 rounded-lg transition-colors hover:border-primary/30 hover:bg-primary/10"
          type="button"
          onClick={onClear}
        >
          <Trash className="h-4 w-4" />
        </Button>

        {/* Text Input */}
        <Input
          value={input}
          onChange={onInputChange}
          placeholder={
            isTrialMode && hasReachedLimit
              ? t.chat.limitReached
              : t.chat.placeholder
          }
          ref={inputRef}
          disabled={isTrialMode && hasReachedLimit}
          className="rounded-lg border-primary/20 bg-card/50 transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40"
        />

        {/* Send Button */}
        <Button
          type="submit"
          disabled={(isTrialMode && hasReachedLimit) || isLoading}
          className="shrink-0 rounded-lg bg-gradient-to-r from-primary to-primary/80 shadow-md transition-all hover:from-primary/90 hover:to-primary/70 hover:shadow-lg"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground" />
          ) : (
            t.chat.send
          )}
        </Button>
      </form>

      {/* Trial Mode Indicator */}
      {isTrialMode && (
        <TrialModeIndicator
          hasReachedLimit={hasReachedLimit}
          remainingChats={remainingChats}
        />
      )}
    </div>
  );
}
