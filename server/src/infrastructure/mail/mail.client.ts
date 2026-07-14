import nodemailer from "nodemailer";
import { config } from "../../config/index.js";
import { logError } from "../logging/index.js";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Low-level mail sender. Doesn't know about templates or business logic —
 * just takes a fully-rendered subject/html and sends it.
 */
export const sendMail = async ({
  to,
  subject,
  html,
}: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: config.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    logError(err, { context: "mail.client.sendMail", to, subject });
    throw err;
  }
};
