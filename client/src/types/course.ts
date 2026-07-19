export interface Lesson {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
  order: number;
  videoRef: string | null;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  lessonCount: number;
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  published: boolean;
  sections: Section[];
}
