import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { searchService } from "./search.service.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { SearchCoursesQuery } from "./search.schema.js"; // ← add this

export const searchCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await searchService.searchCourses(
      req.query as unknown as SearchCoursesQuery,
    );
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Search results fetched",
      results,
    );
  },
);
