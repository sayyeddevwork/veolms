import { prisma } from "../../infrastructure/database/prisma.client.js";
import {
  hashPassword,
  verifyPassword,
} from "../../shared/helpers/password.helper.js";
import {
  generateRawToken,
  hashToken,
} from "../../shared/helpers/token.helper.js";
import { signAccessToken } from "../../shared/helpers/jwt.helper.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../infrastructure/mail/index.js";
import { AppError } from "../../shared/errors/AppError.js";
import { HttpStatusCode } from "../../constants/httpStatusCodes.js";
import { config } from "../../config/index.js";

interface DeviceInfo {
  userAgent?: string;
  ip?: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UserForToken {
  id: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
});

const createSession = async (user: UserForToken, device: DeviceInfo) => {
  const rawRefreshToken = generateRawToken();
  const refreshTokenHash = hashToken(rawRefreshToken);
  const expiresAt = new Date(
    Date.now() + config.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      userAgent: device.userAgent,
      ip: device.ip,
      expiresAt,
    },
  });

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  return { accessToken, rawRefreshToken, session };
};

const register = async (input: RegisterInput, device: DeviceInfo) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new AppError(
      HttpStatusCode.CONFLICT,
      "An account with this email already exists",
      [],
      true,
    );
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
  });

  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(
        Date.now() + config.EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000,
      ),
    },
  });

  const verifyUrl = `${config.app.corsOrigins[0]}/verify-email?token=${rawToken}`;

  try {
    await sendVerificationEmail(user.email, user.name, verifyUrl);
  } catch {
    // already logged inside sendEmail()
  }

  const { accessToken, rawRefreshToken } = await createSession(
    { id: user.id, email: user.email, role: user.role },
    device,
  );

  return { user: toSafeUser(user), accessToken, refreshToken: rawRefreshToken };
};

const login = async (input: LoginInput, device: DeviceInfo) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (
    !user ||
    !user.passwordHash ||
    !(await verifyPassword(user.passwordHash, input.password))
  ) {
    throw new AppError(
      HttpStatusCode.UNAUTHORIZED,
      "Invalid email or password",
      [],
      true,
    );
  }

  const { accessToken, rawRefreshToken } = await createSession(
    { id: user.id, email: user.email, role: user.role },
    device,
  );

  return { user: toSafeUser(user), accessToken, refreshToken: rawRefreshToken };
};

const refreshSession = async (rawRefreshToken: string, device: DeviceInfo) => {
  const tokenHash = hashToken(rawRefreshToken);
  const session = await prisma.session.findUnique({
    where: { refreshTokenHash: tokenHash },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new AppError(
      HttpStatusCode.UNAUTHORIZED,
      "Invalid or expired session",
      [],
      true,
    );
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, "User not found", [], true);
  }

  const { accessToken, rawRefreshToken: newRefreshToken } = await createSession(
    { id: user.id, email: user.email, role: user.role },
    device,
  );

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (rawRefreshToken: string): Promise<void> => {
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.session.updateMany({
    where: { refreshTokenHash: tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

const logoutAllDevices = async (userId: string): Promise<void> => {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

const revokeSession = async (
  userId: string,
  sessionId: string,
): Promise<void> => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== userId) {
    throw new AppError(HttpStatusCode.NOT_FOUND, "Session not found", [], true);
  }
  await prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
};

const listSessions = async (userId: string) => {
  return prisma.session.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    select: {
      id: true,
      userAgent: true,
      ip: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(
        Date.now() + config.PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000,
      ),
    },
  });

  const resetUrl = `${config.app.corsOrigins[0]}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch {
    // already logged inside sendEmail(); don't let this surface to the client
  }
};

const resetPassword = async (
  rawToken: string,
  newPassword: string,
): Promise<void> => {
  const tokenHash = hashToken(rawToken);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new AppError(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      "Invalid or expired reset token",
      [],
      true,
    );
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
};

const verifyEmail = async (rawToken: string): Promise<void> => {
  const tokenHash = hashToken(rawToken);
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    throw new AppError(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      "Invalid or expired verification token",
      [],
      true,
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isEmailVerified: true, emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    }),
  ]);
};

const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  currentSessionId: string,
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (
    !user ||
    !user.passwordHash ||
    !(await verifyPassword(user.passwordHash, currentPassword))
  ) {
    throw new AppError(
      HttpStatusCode.UNAUTHORIZED,
      "Current password is incorrect",
      [],
      true,
    );
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
    prisma.session.updateMany({
      where: { userId, revokedAt: null, id: { not: currentSessionId } },
      data: { revokedAt: new Date() },
    }),
  ]);
};

const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(HttpStatusCode.NOT_FOUND, "User not found", [], true);
  }
  return toSafeUser(user);
};

export default {
  register,
  login,
  refreshSession,
  logout,
  logoutAllDevices,
  revokeSession,
  listSessions,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  getProfile,
};
