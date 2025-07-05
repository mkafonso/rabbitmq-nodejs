import { PropsWithChildren } from "react";

export default async function AuthenticationLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
}
