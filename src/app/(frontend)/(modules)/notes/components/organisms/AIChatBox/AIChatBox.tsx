"use client";

import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { Bot, Trash, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { Input } from "@/app/(frontend)/core/components/atoms/Input/Input";
import { cn } from "@/app/(frontend)/core/utils/utils";
import { trackChatMessage } from "@/app/(frontend)/core/utils/analytics";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";
import { useChatBoxStore } from "../../../stores/useChatBoxStore";
import ChatMessage from "../../molecules/ChatMessage/ChatMessage";

export default function AIChatBox() {
  const locale = useLocale();
  const t = locales[locale];
  const { data: session } = useSession();
  const {
    notes: trialNotes,
    hasReachedChatLimit: hasReachedLimit,
    remainingChats,
    incrementChat,
  } = useTrialModeStore();

  // Use selectors to optimize re-renders
  const isOpen = useChatBoxStore((state) => state.isOpen);
  const closeChatBox = useChatBoxStore((state) => state.closeChatBox);

  // Check if user is in trial mode
  const isTrialMode = !session?.user;

  // Prepare trial notes body if not authenticated
  const body = isTrialMode
    ? {
        trialNotes: trialNotes,
      }
    : undefined;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    body,
  });

  // Wrap handleSubmit to check chat limit for trial users
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if trial user has reached chat limit
    if (isTrialMode && hasReachedLimit) {
      return;
    }

    // Increment chat count for trial users
    if (isTrialMode) {
      const newCount = incrementChat();
      if (newCount === null) {
        // Limit reached
        return;
      }
    }

    // Track chat message
    trackChatMessage(isTrialMode);

    // Call original submit
    originalHandleSubmit(e);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:bottom-4 xl:right-20",
        isOpen ? "fixed" : "hidden",
      )}
    >
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div
          className="scrollbar-clean mt-3 h-full overflow-y-auto px-3"
          ref={scrollRef}
        >
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: t.chat.thinking,
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: t.chat.errorMessage,
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              {t.chat.askQuestion}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title={t.chat.clearChat}
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={
              isTrialMode && hasReachedLimit
                ? t.chat.limitReached
                : t.chat.placeholder
            }
            ref={inputRef}
            disabled={isTrialMode && hasReachedLimit}
          />
          <Button type="submit" disabled={isTrialMode && hasReachedLimit}>
            {t.chat.send}
          </Button>
        </form>
        {isTrialMode && (
          <div className="mb-2 px-3 text-center text-xs text-muted-foreground">
            {hasReachedLimit
              ? t.chat.upgradeMessage
              : `${remainingChats} ${t.chat.remainingChats}`}
          </div>
        )}
      </div>
    </div>
  );
}
