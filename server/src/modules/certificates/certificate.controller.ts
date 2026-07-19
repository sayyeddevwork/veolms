import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { certificateService } from "./certificate.service.js";
import { streamCertificatePdf } from "./certificate.pdf.js";
import { sendSuccess } from "../../shared/response/apiResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";

export const getMyCertificates = asyncHandler(
  async (req: Request, res: Response) => {
    const certificates = await certificateService.listMyCertificates(
      req.user!.id,
    );
    sendSuccess(res, req.requestId, HttpStatusCode.OK, "Certificates fetched", {
      certificates,
    });
  },
);

export const downloadCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await certificateService.getForDownload(
      req.params.id as string,
      req.user!.id,
    );
    streamCertificatePdf(res, data);
  },
);

export const verifyCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await certificateService.verify(req.params.code as string);
    sendSuccess(
      res,
      req.requestId,
      HttpStatusCode.OK,
      "Certificate verified",
      result,
    );
  },
);
