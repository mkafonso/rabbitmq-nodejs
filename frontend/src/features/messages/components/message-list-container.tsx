"use client";

import { useState } from "react";
import { Message } from "../types";
import { MessageList } from "./message-list";
import { MessageTextarea } from "./message-textarea";

export function MessageListContainer() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Olá! Como posso te ajudar?", sender: "other" },
    { id: "2", content: "Estou com uma dúvida sobre o produto.", sender: "me" },
  ]);

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "me",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden p-0">
        <MessageList messages={messages} />
      </div>

      <MessageTextarea onSend={handleSend} />
    </div>
  );
}
