"use server";

import { authenticateUserSchema } from "@/features/users/schemas";
import { authenticateUserService } from "@/features/users/services/authenticate-user.service";
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticateUserAction(_: unknown, data: FormData) {
  const result = authenticateUserSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  try {
    const { username, password } = result.data;
    const response = await authenticateUserService({
      username,
      password,
    });

    (await cookies()).set("projeto:token", response.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      const statusCode = error.response.status;

      let message = "Ocorreu um erro. Por favor, tente novamente mais tarde.";

      switch (statusCode) {
        case 400:
          message =
            "Dados inválidos. Por favor, verifique as informações fornecidas.";
          break;
        case 401:
          message = "Credentiais inválidas ou usuário já está sendo utilizado.";
          break;
        default:
          message = "Erro no servidor. Tente novamente em alguns instantes.";
      }

      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message:
        "Tente de novo dentro de alguns instantes. Tivemos um problema para realizar a operação.",
      errors: null,
    };
  }

  redirect("/");
}
