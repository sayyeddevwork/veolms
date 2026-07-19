import { prisma } from "../../infrastructure/database/prisma.client.js";
import { Prisma } from "../../infrastructure/database/prisma.client.js";

interface SearchParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: "newest" | "priceAsc" | "priceDesc" | "rating";
  page: number;
  limit: number;
}

const buildOrderBy = (
  sortBy: SearchParams["sortBy"],
): Prisma.CourseOrderByWithRelationInput => {
  switch (sortBy) {
    case "priceAsc":
      return { price: "asc" };
    case "priceDesc":
      return { price: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
    // "rating" sort handled post-query since it's an aggregate, not a direct column
  }
};

export const searchRepository = {
  search: async (params: SearchParams) => {
    const where: Prisma.CourseWhereInput = {
      published: true,
      ...(params.q && {
        OR: [
          { title: { contains: params.q, mode: "insensitive" } },
          { description: { contains: params.q, mode: "insensitive" } },
        ],
      }),
      ...(params.minPrice !== undefined || params.maxPrice !== undefined
        ? {
            price: {
              ...(params.minPrice !== undefined && { gte: params.minPrice }),
              ...(params.maxPrice !== undefined && { lte: params.maxPrice }),
            },
          }
        : {}),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: { select: { name: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: buildOrderBy(params.sortBy),
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      prisma.course.count({ where }),
    ]);

    return { courses, total };
  },
};
