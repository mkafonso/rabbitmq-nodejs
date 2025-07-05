import { QueryClient } from "@tanstack/react-query";

let browserClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return browserClient ?? (browserClient = makeQueryClient());
}
