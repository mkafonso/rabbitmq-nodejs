"use server";

import { sendMessageSchema } from "@/features/messages/schemas";
import { sendMessageService } from "@/features/messages/services/send-message.service";
import { HTTPError } from "ky";

export async function sendMessageAction(_: unknown, data: FormData) {
  const result = sendMessageSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  try {
    const { content } = result.data;
    await sendMessageService({ content });

    return { success: true, message: null, errors: null };
  } catch (error) {
    if (error instanceof HTTPError) {
      const statusCode = error.response.status;

      let message = "Ocorreu um erro ao enviar a mensagem. Tente novamente.";

      switch (statusCode) {
        case 400:
          message = "Dados inválidos. Verifique a mensagem.";
          break;
        case 401:
          message = "Você precisa estar autenticado para enviar mensagens.";
          break;
        default:
          message = "Erro no servidor. Tente novamente em alguns instantes.";
      }

      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro inesperado. Tente novamente em alguns instantes.",
      errors: null,
    };
  }
}
