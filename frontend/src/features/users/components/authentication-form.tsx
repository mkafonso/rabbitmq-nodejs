import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthenticationForm() {
  return (
    <div className="space-y-6 w-full max-w-sm md:px-0 px-4">
      <h1 className="text-2xl font-semibold tracking-tight text-center">
        Bem-vindo! Faça login <br /> ou cadastre-se
      </h1>

      <form className="space-y-4 w-full">
        <Input placeholder="Digite seu nome de usuario" />
        <Input placeholder="Digite sua senha" />

        <Button
          size="lg"
          className="w-full font-semibold uppercase"
          type="submit"
        >
          Acessar
        </Button>
      </form>
    </div>
  );
}
