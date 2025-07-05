import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SendMessageFormData } from "../schemas";
import { listMessagesService } from "../services/list-messages.service";
import { sendMessageService } from "../services/send-message.service";
import { Message } from "../types";

export const useListMessages = () => {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await listMessagesService();
      return response.messages;
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SendMessageFormData>({
    mutationFn: sendMessageService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
