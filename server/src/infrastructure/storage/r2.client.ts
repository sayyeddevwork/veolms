import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { config } from "../../config/index.js";
import { randomUUID } from "crypto";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${config.app.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.app.r2.accessKeyId,
    secretAccessKey: config.app.r2.secretAccessKey,
  },
});

export const uploadFile = async (
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> => {
  const extension = originalName.split(".").pop();
  const key = `thumbnails/${randomUUID()}.${extension}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: config.app.r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  return `${config.app.r2.publicUrl}/${key}`;
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const key = fileUrl.replace(`${config.app.r2.publicUrl}/`, "");
  await r2Client.send(
    new DeleteObjectCommand({ Bucket: config.app.r2.bucketName, Key: key }),
  );
};
