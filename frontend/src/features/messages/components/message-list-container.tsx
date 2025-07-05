"use client";

import { MessageList } from "./message-list";
import { MessageTextarea } from "./message-textarea";

export function MessageListContainer() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden p-0">
        <MessageList />
      </div>

      <MessageTextarea onSend={() => {}} />
    </div>
  );
}
