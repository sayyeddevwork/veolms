import { searchRepository } from "./search.repository.js";
import { SearchCoursesQuery } from "./search.schema.js";
import { SearchResults } from "./search.types.js";

export const searchService = {
  searchCourses: async (query: SearchCoursesQuery): Promise<SearchResults> => {
    const { courses, total } = await searchRepository.search(query);

    let results = courses.map((course) => {
      const ratings = course.reviews.map((r) => r.rating);
      const averageRating = ratings.length
        ? Math.round(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10,
          ) / 10
        : 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        instructorName: course.instructor.name,
        averageRating,
        totalReviews: ratings.length,
      };
    });

    // "rating" sort is computed post-query since it's derived, not a raw column
    if (query.sortBy === "rating") {
      results = results.sort((a, b) => b.averageRating - a.averageRating);
    }

    return {
      results,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
};
