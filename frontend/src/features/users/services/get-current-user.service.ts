import { api } from "@/lib/api-client";

export interface CurrentUser {
  id: string;
  username: string;
}

export const getCurrentUserService = async (): Promise<CurrentUser> => {
  const response = await api.get("users/me");
  return response.json();
};
