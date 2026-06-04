"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ChatContextType {
  hasChat: boolean;
  setHasChat: (val: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
  hasChat: false,
  setHasChat: () => {},
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const [hasChat, setHasChat] = useState(false);
  return (
    <ChatContext.Provider value={{ hasChat, setHasChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
