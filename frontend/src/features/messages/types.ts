export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_username: string;
  created_at: Date;
}

export interface ListMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ListMessagesParams {
  page?: number;
  per_page?: number;
}
