"use client";

import { Bot } from "lucide-react";
import { useChatBoxStore } from "@/app/(frontend)/(modules)/notes/stores/useChatBoxStore";
import { Button } from "../../atoms/Button/Button";

export default function AIChatButton() {
  // Use selector to optimize re-renders and get both state and toggle function
  const isOpen = useChatBoxStore((state) => state.isOpen);
  const toggleChatBox = useChatBoxStore((state) =>
    state.isOpen ? state.closeChatBox : state.openChatBox,
  );

  return (
    <Button
      onClick={toggleChatBox}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full p-0 shadow-2xl transition-all duration-300 hover:scale-110"
      size="icon"
      title={isOpen ? "Close AI Chat" : "Open AI Chat"}
    >
      <Bot size={22} />
    </Button>
  );
}
