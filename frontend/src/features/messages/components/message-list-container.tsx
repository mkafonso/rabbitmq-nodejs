"use client";

import { getCurrentUserAction } from "@/actions/get-current-user.action";
import { useEffect, useRef, useState } from "react";
import { useListMessages, useSendMessage } from "../hooks/messages";
import { MessageList } from "./message-list";
import { MessageTextarea } from "./message-textarea";

export function MessageListContainer() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { data: messages = [], isLoading: loading, error } = useListMessages();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const [forceScrollToLast, setForceScrollToLast] = useState(false);
  const wasSending = useRef(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userResult = await getCurrentUserAction();
        if (userResult.success && userResult.data) {
          setCurrentUserId(userResult.data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário atual:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (wasSending.current && !isSending) {
      setForceScrollToLast(true);
    }
    wasSending.current = isSending;
  }, [isSending]);

  useEffect(() => {
    if (forceScrollToLast) {
      setForceScrollToLast(false);
    }
  }, [forceScrollToLast]);

  const handleSendMessage = async (content: string) => {
    sendMessage({ content });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden p-0">
        <MessageList
          messages={[...messages].reverse()}
          loading={loading}
          error={error?.message || null}
          currentUserId={currentUserId}
          forceScrollToLast={forceScrollToLast}
        />
      </div>

      <MessageTextarea
        onSend={handleSendMessage}
        currentUserId={currentUserId}
        isLoading={isSending}
      />
    </div>
  );
}
