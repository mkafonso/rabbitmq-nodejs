"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Message } from "../types";

type Props = {
  messages: Message[];
};

export function MessageList(props: Props) {
  const { messages } = props;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <ScrollArea className="h-full p-4" ref={scrollRef}>
      <div className="flex flex-col gap-3 pb-32">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] rounded-md p-2 text-sm ${
              msg.sender === "me"
                ? "self-end bg-violet-500 text-white"
                : "self-start bg-muted"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
