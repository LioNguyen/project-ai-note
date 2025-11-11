"use client";

import { useChat } from "ai/react";
import { Bot, Trash, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/app/(frontend)/core/components/atoms/Button/Button";
import { Input } from "@/app/(frontend)/core/components/atoms/Input/Input";
import { cn } from "@/app/(frontend)/core/utils/utils";
import { locales } from "@/app/(frontend)/core/i18n";
import { useLocale } from "@/app/(frontend)/core/store/useLanguageStore";
import { useChatBoxStore } from "../../../stores/useChatBoxStore";
import ChatMessage from "../../molecules/ChatMessage/ChatMessage";

export default function AIChatBox() {
  const locale = useLocale();
  const t = locales[locale];

  // Use selectors to optimize re-renders
  const isOpen = useChatBoxStore((state) => state.isOpen);
  const closeChatBox = useChatBoxStore((state) => state.closeChatBox);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

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
            placeholder={t.chat.placeholder}
            ref={inputRef}
          />
          <Button type="submit">{t.chat.send}</Button>
        </form>
      </div>
    </div>
  );
}
