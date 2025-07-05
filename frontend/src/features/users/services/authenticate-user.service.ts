import { api } from "@/lib/api-client";
import { AuthenticateUserFormData } from "../schemas";
import { AuthenticateUserResponse } from "../types";

export const authenticateUserService = async (
  data: AuthenticateUserFormData
): Promise<AuthenticateUserResponse> => {
  const response = await api.post("users", { json: data });
  return response.json<AuthenticateUserResponse>();
};
