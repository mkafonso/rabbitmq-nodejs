import { PropsWithChildren } from "react";

export default async function ApplicationLayout(props: PropsWithChildren) {
  const { children } = props;
  return <div className="w-full h-full overflow-hidden">{children}</div>;
}
