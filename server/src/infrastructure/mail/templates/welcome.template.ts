interface WelcomeTemplateParams {
  name: string;
  verifyUrl: string;
}

export const welcomeTemplate = ({
  name,
  verifyUrl,
}: WelcomeTemplateParams) => ({
  subject: "Welcome! Please verify your email",
  html: `
    <p>Hi ${name},</p>
    <p>Welcome aboard! Please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
  `,
});
