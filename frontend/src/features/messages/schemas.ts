import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().min(1, { message: "Mensagem não pode estar vazia" }),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
