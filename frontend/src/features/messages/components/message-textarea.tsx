"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
};

export function MessageTextarea({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
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
        />
        <Button
          onClick={handleSubmit}
          className="absolute bottom-2 right-2 h-8 px-3 text-sm"
          type="button"
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
