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
 * Features enhanced animations, visual hierarchy, and theme consistency
 */
export default function ChatMessage({
  message: { role, content },
}: ChatMessageProps) {
  const { data: session } = useSession();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-6 flex items-end gap-2 duration-300 animate-in fade-in slide-in-from-bottom-2",
        isAiMessage ? "justify-start" : "justify-end",
      )}
    >
      {/* AI Avatar and Message */}
      {isAiMessage && (
        <>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="max-w-xs lg:max-w-md">
            <div className="rounded-2xl rounded-tl-sm border border-primary/20 bg-gradient-to-br from-card/50 to-muted/20 px-4 py-3 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground [&>*]:my-1 [&>*]:leading-relaxed">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </>
      )}

      {/* User Avatar and Message */}
      {!isAiMessage && (
        <>
          <div className="max-w-xs lg:max-w-md">
            <div className="rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-primary/80 px-4 py-3 shadow-md transition-shadow hover:shadow-lg">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary-foreground">
                {content}
              </p>
            </div>
          </div>

          {/* User Avatar */}
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User avatar"
              width={100}
              height={100}
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 ring-2 ring-primary/30">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
