"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (content: string) => Promise<void>;
  currentUserId: string | null;
  isLoading?: boolean;
};

export function MessageTextarea({
  onSend,
  currentUserId,
  isLoading = false,
}: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !currentUserId) return;

    try {
      await onSend(trimmed);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-background sticky bottom-0">
      <div className="relative w-full">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
          className="w-full pr-20 resize-none min-h-[60px]"
          rows={2}
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          className="absolute bottom-2 right-2 h-8 px-3 text-sm"
          type="button"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}
