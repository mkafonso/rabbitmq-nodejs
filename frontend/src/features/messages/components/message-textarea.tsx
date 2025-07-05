"use client";

import { sendMessageAction } from "@/actions/send-message.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState, useTransition } from "react";

type Props = {
  onSend: (text: string) => void;
};

export function MessageTextarea({ onSend }: Props) {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    onSend(trimmed);
    setInput("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("content", trimmed);

      const result = await sendMessageAction(null, formData);

      if (!result.success) {
        console.error("Failed to send message:", result.message);
      }
    });
  };

  return (
    <div className="bg-background sticky bottom-0">
      <div className="relative w-full">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full pr-20 resize-none min-h-[60px]"
          rows={2}
          disabled={isPending}
        />
        <Button
          onClick={handleSubmit}
          className="absolute bottom-2 right-2 h-8 px-3 text-sm"
          type="button"
          disabled={isPending}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
