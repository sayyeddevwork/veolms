import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { queryKeys } from "@/lib/queryKeys";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutations (enroll, mark-read, create review, ...) are NOT retried
      // automatically — a retried POST/PATCH can double-submit. Individual
      // mutations opt back in with their own retry if they're safely idempotent.
      retry: 0,
    },
  },
});

// --- Selective cache persistence ---------------------------------------
// Only the public course catalog is worth surviving a page reload — it's
// non-sensitive and expensive to refetch. Enrollments, notifications,
// progress, and anything auth-related are deliberately excluded so a
// shared/public machine never leaves another user's data in localStorage.
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "veolms-query-cache",
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60_000, // 24h
  buster: "v1", // bump this string on any breaking API/shape change to drop stale caches
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const rootKey = query.queryKey[0];
      return rootKey === queryKeys.courses.all[0];
    },
  },
});
