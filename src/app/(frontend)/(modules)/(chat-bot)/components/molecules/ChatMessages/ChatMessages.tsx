"use client";

import { Bot } from "lucide-react";
import { Message } from "ai";
import { useTranslation } from "react-i18next";
import ChatMessage from "../../atoms/ChatMessage/ChatMessage";
import LoadingIndicator from "../../atoms/LoadingIndicator/LoadingIndicator";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | undefined;
  lastMessageIsUser: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

/**
 * ChatMessages Component
 * Displays the chat messages area with loading and empty states
 */
export default function ChatMessages({
  messages,
  isLoading,
  error,
  lastMessageIsUser,
  scrollRef,
}: ChatMessagesProps) {
  const { t } = useTranslation();

  return (
    <div
      className="scrollbar-clean mt-2 h-full space-y-1 overflow-y-auto px-4 py-2"
      ref={scrollRef}
    >
      {/* Rendered Messages */}
      {messages.map((message) => (
        <ChatMessage message={message} key={message.id} />
      ))}

      {/* Loading State */}
      {isLoading && lastMessageIsUser && (
        <div className="mb-4 flex justify-start">
          <div className="flex items-end gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10">
              <Bot className="h-4 w-4 animate-bounce text-primary" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-primary/20 bg-gradient-to-br from-card/50 to-muted/20 px-4 py-3">
              <LoadingIndicator />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <ChatMessage
          message={{
            role: "assistant",
            content: t("chat.errorMessage"),
          }}
        />
      )}

      {/* Empty State */}
      {!error && messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {t("chat.askQuestion")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("chat.emptyStateSubtitle")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
