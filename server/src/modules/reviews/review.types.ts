export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewSummary {
  id: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface CourseRatingSummary {
  averageRating: number;
  totalReviews: number;
}
