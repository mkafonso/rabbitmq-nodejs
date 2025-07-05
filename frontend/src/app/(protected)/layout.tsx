import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function ApplicationLayout(props: PropsWithChildren) {
  const { children } = props;
  const cookieStore = await cookies();
  const token = cookieStore.get("projeto:token");

  if (!token) {
    redirect("/entrar");
  }

  return <div className="w-full h-full overflow-hidden">{children}</div>;
}
