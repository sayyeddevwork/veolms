export interface CreateLessonInput {
  title: string;
  videoRef: string;
  duration?: number;
  isPreview?: boolean;
  order: number;
}

export interface UpdateLessonInput {
  title?: string;
  videoRef?: string;
  duration?: number;
  isPreview?: boolean;
  order?: number;
}
