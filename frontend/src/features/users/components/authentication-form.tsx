"use client";

import { authenticateUserAction } from "@/actions/authenticate-user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export function AuthenticationForm() {
  const [state, formAction, isPending] = useActionState(
    authenticateUserAction,
    null
  );

  return (
    <div className="space-y-6 w-full max-w-sm md:px-0 px-4">
      <h1 className="text-2xl font-semibold tracking-tight text-center">
        Bem-vindo! Faça login <br /> ou cadastre-se
      </h1>

      <form className="space-y-4 w-full" action={formAction}>
        <div>
          <Input
            id="username"
            name="username"
            placeholder="Digite seu nome de usuario"
          />
          {state?.errors?.username?.[0] && (
            <span className="text-sm text-rose-500">
              {state?.errors?.username?.[0]}
            </span>
          )}
        </div>

        <div>
          <Input
            id="password"
            name="password"
            placeholder="Digite sua senha"
            type="password"
          />
          {state?.errors?.password?.[0] && (
            <span className="text-sm text-rose-500">
              {state?.errors?.password?.[0]}
            </span>
          )}
        </div>

        <Button
          className="w-full font-semibold uppercase"
          type="submit"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Acessar"}
        </Button>
      </form>
    </div>
  );
}
