import { Router } from "express";
import { searchCourses } from "./search.controller.js";
import { validate } from "../../middleware/validate.js";
import { searchCoursesSchema } from "./search.schema.js";

const router = Router();

router.get("/courses", validate(searchCoursesSchema), searchCourses);

export default router;
