import { QueryClient } from "@tanstack/react-query";

const FIVE_SECONDS = 1000 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      retryDelay: FIVE_SECONDS,
    },
  },
});
