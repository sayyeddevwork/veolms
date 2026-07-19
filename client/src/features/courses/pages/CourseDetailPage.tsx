import { useParams } from "react-router-dom";
import { useCourse } from "../api/courses.queries";
import { useMyEnrollments } from "@/features/enrollment/api/enrollment.queries";
import { useEnrollFree } from "@/features/enrollment/api/enrollment.mutations";
import { useAppSelector } from "@/store/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading, isError, refetch } = useCourse(courseId);
  const isAuthenticated = useAppSelector((s) => Boolean(s.auth.user));
  const { data: enrollments } = useMyEnrollments();
  const enrollMutation = useEnrollFree(courseId ?? "");

  const isEnrolled = enrollments?.some((e) => e.courseId === courseId);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-8 aspect-video w-full" />
      </section>
    );
  }

  if (isError || !course) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <ErrorState
          message="Couldn't load this course."
          onRetry={() => refetch()}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl">{course.title}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{course.description}</p>

      <div className="mt-6 flex items-center gap-4">
        <span className="text-lg font-medium">
          {course.price === 0 ? "Free" : `₹${(course.price / 100).toFixed(0)}`}
        </span>

        {!isAuthenticated && (
          <span className="text-sm text-ink/50">Log in to enroll</span>
        )}

        {isAuthenticated && course.price === 0 && (
          <button
            onClick={() => enrollMutation.mutate()}
            disabled={isEnrolled || enrollMutation.isPending}
            className="rounded-full bg-signal px-5 py-2 text-sm font-medium text-ink disabled:opacity-60"
          >
            {isEnrolled
              ? "Enrolled ✓"
              : enrollMutation.isPending
                ? "Enrolling…"
                : "Enroll for free"}
          </button>
        )}

        {isAuthenticated && course.price > 0 && !isEnrolled && (
          <button className="rounded-full bg-signal px-5 py-2 text-sm font-medium text-ink">
            Buy course
          </button>
        )}
      </div>

      <div className="mt-10 space-y-6">
        {course.sections.map((section) => (
          <div key={section.id}>
            <h2 className="font-display text-xl">{section.title}</h2>
            <ul className="mt-2 divide-y divide-line/10 rounded-lg border border-line/10 bg-white">
              {section.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span>{lesson.title}</span>
                  <span className="text-ink/40">
                    {lesson.isPreview ? "Preview" : isEnrolled ? "Watch" : "🔒"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
