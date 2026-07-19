export interface UpdateProgressInput {
  watchedSeconds: number;
  completed?: boolean;
}

export interface LessonProgressView {
  lessonId: string;
  watchedSeconds: number;
  completed: boolean;
  lastWatchedAt: Date;
}

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
}
