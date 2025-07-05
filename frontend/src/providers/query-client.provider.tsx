"use client";

import { getQueryClient } from "@/lib/query-client";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";

type QueryClientProviderProps = {
  children: React.ReactNode;
};

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  const queryClient = getQueryClient();

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
}
