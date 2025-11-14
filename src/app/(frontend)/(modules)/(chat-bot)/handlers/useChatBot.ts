import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";

import { trackChatMessage } from "@/app/(frontend)/core/utils/analytics";
import { useTrialModeStore } from "@/app/(frontend)/core/store/useTrialModeStore";
import { useChatBoxStore } from "../../notes/stores/useChatBoxStore";

/**
 * Custom hook to handle all ChatBot logic and state management
 * Separates business logic from UI rendering for better maintainability
 */
export function useChatBot() {
  const { data: session } = useSession();

  // Use selectors to optimize re-renders
  const trialNotes = useTrialModeStore((state) => state.notes);
  const hasReachedLimit = useTrialModeStore(
    (state) => state.hasReachedChatLimit,
  );
  const remainingChats = useTrialModeStore((state) => state.remainingChats);
  const incrementChat = useTrialModeStore((state) => state.incrementChat);

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

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Check if last message is from user
  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  /**
   * Wraps the original handleSubmit to:
   * - Check chat limits for trial users
   * - Increment chat count
   * - Track analytics
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
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
    },
    [isTrialMode, hasReachedLimit, incrementChat, originalHandleSubmit],
  );

  // Clear all messages
  const handleClearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close chat when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click target is outside the chat box
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target as Node)
      ) {
        closeChatBox();
      }
    };

    // Add event listener with slight delay to avoid immediate triggering
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeChatBox]);

  return {
    // State
    isOpen,
    isTrialMode,
    hasReachedLimit,
    remainingChats,
    messages,
    input,
    isLoading,
    error,
    lastMessageIsUser,

    // Refs
    inputRef,
    scrollRef,
    chatBoxRef,

    // Actions
    handleInputChange,
    handleSubmit,
    handleClearMessages,
    closeChatBox,
  };
}
