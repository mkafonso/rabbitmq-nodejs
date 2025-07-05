"use server";

import { getCurrentUserService } from "@/features/users/services/get-current-user.service";

export async function getCurrentUserAction() {
  try {
    const user = await getCurrentUserService();
    return { success: true, data: user, error: null };
  } catch (error: any) {
    console.error("Erro ao obter usuário atual:", error);

    let message = "Erro ao obter informações do usuário.";

    if (error?.response?.status) {
      const statusCode = error.response.status;

      switch (statusCode) {
        case 401:
          message = "Usuário não autenticado.";
          break;
        case 403:
          message = "Acesso negado.";
          break;
        default:
          message = "Erro no servidor. Tente novamente em alguns instantes.";
      }
    }

    return { success: false, data: null, error: message };
  }
}
