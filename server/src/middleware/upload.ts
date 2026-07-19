import multer from "multer";
import { AppError } from "../shared/errors/AppError.js";
import { HttpStatusCode } from "../constants/httpStatusCodes.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const uploadThumbnail = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          HttpStatusCode.BAD_REQUEST,
          "Only JPEG, PNG, or WEBP images are allowed",
        ),
      );
    }
    cb(null, true);
  },
}).single("thumbnail");
