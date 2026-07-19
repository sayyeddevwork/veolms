// search.types.ts
export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructorName: string;
  averageRating: number;
  totalReviews: number;
}

export interface SearchResults {
  results: SearchResultItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
