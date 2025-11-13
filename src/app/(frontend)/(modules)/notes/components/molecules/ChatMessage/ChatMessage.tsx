"use client";

import { useSession } from "next-auth/react";
import { Message } from "ai";
import { Bot, User } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { cn } from "@/app/(frontend)/core/utils/utils";

interface ChatMessageProps {
  message: Pick<Message, "role" | "content">;
}

/**
 * Chat Message Component
 * Displays individual chat messages from user or AI assistant
 */
export default function ChatMessage({
  message: { role, content },
}: ChatMessageProps) {
  const { data: session } = useSession();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <div
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {isAiMessage ? (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*]:my-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {!isAiMessage && (
        <>
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User image"
              width={100}
              height={100}
              className="ml-2 h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
