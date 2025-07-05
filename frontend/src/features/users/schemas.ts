import { z } from "zod";

export const authenticateUserSchema = z.object({
  username: z.string().min(1, { message: "Usuário é um campo obrigatório" }),
  password: z.string().min(8, { message: "Senha muita curta" }),
});

export type AuthenticateUserFormData = z.infer<typeof authenticateUserSchema>;
