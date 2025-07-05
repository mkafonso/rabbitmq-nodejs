import { api } from "@/lib/api-client";
import { ListMessagesParams, ListMessagesResponse } from "../types";

export const listMessagesService = async (
  params?: ListMessagesParams
): Promise<ListMessagesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.per_page) {
    searchParams.append("perPage", params.per_page.toString());
  }

  const queryString = searchParams.toString();
  const url = queryString ? `messages?${queryString}` : "messages";

  const response = await api.get(url);
  return response.json();
};
