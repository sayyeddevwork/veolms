import PDFDocument from "pdfkit";
import { Response } from "express";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  issuedAt: Date;
  verificationCode: string;
}

export const streamCertificatePdf = (res: Response, data: CertificateData) => {
  const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="certificate-${data.verificationCode}.pdf"`,
  );

  doc.pipe(res);

  doc
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(3)
    .stroke("#4F46E5");

  doc
    .fontSize(32)
    .fillColor("#1F2937")
    .text("Certificate of Completion", 0, 120, { align: "center" });

  doc
    .fontSize(16)
    .fillColor("#6B7280")
    .text("This is to certify that", 0, 190, { align: "center" });

  doc
    .fontSize(28)
    .fillColor("#111827")
    .text(data.studentName, 0, 220, { align: "center" });

  doc
    .fontSize(16)
    .fillColor("#6B7280")
    .text("has successfully completed the course", 0, 270, { align: "center" });

  doc
    .fontSize(22)
    .fillColor("#4F46E5")
    .text(data.courseTitle, 0, 300, { align: "center" });

  doc
    .fontSize(12)
    .fillColor("#9CA3AF")
    .text(`Issued on ${data.issuedAt.toDateString()}`, 0, 370, {
      align: "center",
    })
    .text(`Verification Code: ${data.verificationCode}`, 0, 390, {
      align: "center",
    });

  doc.end();
};
