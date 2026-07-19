// search.schema.ts
import { z } from "zod";

const searchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sortBy: z
    .enum(["newest", "priceAsc", "priceDesc", "rating"])
    .default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export const searchCoursesSchema = {
  query: searchQuerySchema,
};

export type SearchCoursesQuery = z.infer<typeof searchQuerySchema>;
