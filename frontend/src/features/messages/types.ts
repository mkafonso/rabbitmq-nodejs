export interface Message {
  id: string;
  content: string;
  sender: "me" | "other";
}
