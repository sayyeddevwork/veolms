import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import type { Enrollment } from "@/types/enrollment";
import { enrollFreeRequest } from "./enrollment.api";

/**
 * Optimistically adds the enrollment to the cached "my enrollments" list
 * the instant the user clicks Enroll, so the UI updates with zero perceived
 * latency. If the request fails (course isn't actually free, network error,
 * already enrolled, etc.) the cache is rolled back to its prior state.
 */
export function useEnrollFree(courseId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.enrollments.mine();

  return useMutation({
    mutationFn: () => enrollFreeRequest(courseId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Enrollment[]>(key);

      const optimisticEnrollment: Enrollment = {
        id: `optimistic-${courseId}`,
        courseId,
        paymentStatus: "PAID",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Enrollment[]>(key, (old = []) => [
        ...old,
        optimisticEnrollment,
      ]);

      return { previous };
    },

    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },

    onSettled: () => {
      // Reconcile with the server's real record (real id, real timestamp).
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
