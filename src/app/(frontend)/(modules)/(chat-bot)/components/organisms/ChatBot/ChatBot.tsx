"use client";

import { cn } from "@/app/(frontend)/core/utils/utils";
import { useChatBot } from "../../../handlers/useChatBot";
import ChatHeader from "../../molecules/ChatHeader/ChatHeader";
import ChatMessages from "../../molecules/ChatMessages/ChatMessages";
import ChatInputForm from "../../molecules/ChatInputForm/ChatInputForm";

/**
 * ChatBot Component
 * Main chatbot organism that composes header, messages, and input form molecules
 * Displays an AI-powered chatbot interface for users to ask questions about their notes
 * Supports both authenticated users and trial mode with chat limits
 */
export default function ChatBot() {
  // Use the custom hook that contains all business logic
  const {
    isOpen,
    isTrialMode,
    hasReachedLimit,
    remainingChats,
    messages,
    input,
    isLoading,
    error,
    lastMessageIsUser,
    inputRef,
    scrollRef,
    chatBoxRef,
    handleInputChange,
    handleSubmit,
    handleClearMessages,
  } = useChatBot();

  return (
    <div
      ref={chatBoxRef}
      className={cn(
        "fixed bottom-0 right-0 z-10 w-full max-w-[500px] p-2 transition-all duration-300",
        isOpen
          ? "visible opacity-100 xl:bottom-4 xl:right-20"
          : "invisible opacity-0 xl:bottom-0 xl:right-0",
      )}
    >
      {/* Glass-morphism effect container */}
      <div className="flex h-[600px] flex-col rounded-2xl border border-primary/10 bg-gradient-to-br from-background/95 via-card/90 to-background/95 shadow-2xl backdrop-blur-lg transition-all hover:border-primary/20">
        {/* Header Section */}
        <ChatHeader />

        {/* Messages Section */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          error={error}
          lastMessageIsUser={lastMessageIsUser}
          scrollRef={scrollRef}
        />

        {/* Input Section */}
        <ChatInputForm
          input={input}
          isLoading={isLoading}
          isTrialMode={isTrialMode}
          hasReachedLimit={hasReachedLimit}
          remainingChats={remainingChats}
          inputRef={inputRef}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClear={handleClearMessages}
        />
      </div>
    </div>
  );
}
