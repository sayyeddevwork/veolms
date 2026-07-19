import { memo } from "react";
import { Link } from "react-router-dom";
import type { CourseListItem } from "@/types/course";

function CourseCardImpl({ course }: { course: CourseListItem }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group overflow-hidden rounded-xl border border-line/10 bg-white transition hover:border-line/30"
    >
      <div className="aspect-video overflow-hidden bg-paper-dim">
        <img
          src={course.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg leading-snug">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">
          {course.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-ink/50">{course.lessonCount} lessons</span>
          <span className="font-medium">
            {course.price === 0
              ? "Free"
              : `₹${(course.price / 100).toFixed(0)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}

export const CourseCard = memo(CourseCardImpl);
