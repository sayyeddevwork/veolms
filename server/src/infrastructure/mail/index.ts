import { sendMail } from "./mail.client.js";
import { welcomeTemplate } from "./templates/welcome.template.js";
import { resetPasswordTemplate } from "./templates/reset-password.template.js";

export const sendVerificationEmail = async (
  to: string,
  name: string,
  verifyUrl: string,
): Promise<void> => {
  const { subject, html } = welcomeTemplate({ name, verifyUrl });
  await sendMail({ to, subject, html });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetUrl: string,
): Promise<void> => {
  const { subject, html } = resetPasswordTemplate({ resetUrl });
  await sendMail({ to, subject, html });
};
