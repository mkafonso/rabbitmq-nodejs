"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Message } from "../types";

type Props = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentUserId: string | null;
  forceScrollToLast?: boolean;
};

export function MessageList({
  messages,
  loading,
  error,
  currentUserId,
  forceScrollToLast,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const previousMessagesLength = useRef(0);

  useEffect(() => {
    if (loading) return;

    if (isFirstLoad.current && messages.length > 0) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "instant",
          block: "end",
        });
      }, 100);
      isFirstLoad.current = false;
      previousMessagesLength.current = messages.length;
      return;
    }

    if (
      !isFirstLoad.current &&
      messages.length > previousMessagesLength.current
    ) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
      previousMessagesLength.current = messages.length;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (forceScrollToLast && messages.length > 0) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [forceScrollToLast, messages.length]);

  if (loading) {
    return (
      <ScrollArea className="h-full p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Carregando mensagens...</div>
        </div>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <ScrollArea className="h-full p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">{error}</div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full p-4" ref={scrollRef}>
      <div className="flex flex-col gap-10 pb-32">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma mensagem encontrada
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`space-y-1 max-w-[65%] w-full ${
                msg.sender_id === currentUserId ? "self-end" : "self-start"
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="font-semibold text-xs">
                  {msg.sender_id === currentUserId
                    ? "Você"
                    : msg.sender_username}
                </strong>
              </div>

              <div
                className={`w-full rounded-md p-3 text-sm ${
                  msg.sender_id === currentUserId
                    ? "self-end bg-cyan-800 text-zinc-200"
                    : "self-start bg-muted"
                }`}
              >
                <div>{msg.content}</div>

                <time className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleString()}
                </time>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
