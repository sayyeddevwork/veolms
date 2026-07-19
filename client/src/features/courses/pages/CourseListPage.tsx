import { useCourses } from "../api/courses.queries";
import { CourseCard } from "../components/CourseCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export function CourseListPage() {
  const { data: courses, isLoading, isError, refetch, isFetching } = useCourses();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl">All courses</h1>
        {isFetching && !isLoading && (
          <span className="text-xs text-ink/40">Refreshing…</span>
        )}
      </div>

      {isLoading && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-8">
          <ErrorState
            message="Couldn't load courses right now."
            onRetry={() => refetch()}
          />
        </div>
      )}

      {courses && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}
