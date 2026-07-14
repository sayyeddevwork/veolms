interface ResetPasswordTemplateParams {
  resetUrl: string;
}

export const resetPasswordTemplate = ({
  resetUrl,
}: ResetPasswordTemplateParams) => ({
  subject: "Reset your password",
  html: `
    <p>We received a request to reset your password.</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link expires in 60 minutes. If you didn't request this, you can safely ignore this email.</p>
  `,
});
