export interface CreateCourseInput {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  published?: boolean;
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  published: boolean;
  lessonCount: number;
  createdAt: Date;
}
