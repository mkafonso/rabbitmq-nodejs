import { api } from "@/lib/api-client";
import { SendMessageFormData } from "../schemas";

export const sendMessageService = async (
  data: SendMessageFormData
): Promise<void> => {
  await api.post("messages", { json: data });
};
