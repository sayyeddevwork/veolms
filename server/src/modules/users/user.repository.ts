import { prisma } from "../../infrastructure/database/prisma.client.js";
import { UserRole } from "../../shared/types/roles.js";

const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isEmailVerified: true,
  createdAt: true,
} as const;

export const userRepository = {
  findById: (id: string) => {
    return prisma.user.findUnique({ where: { id }, select: safeSelect });
  },

  findAll: () => {
    return prisma.user.findMany({
      select: safeSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  updateProfile: (id: string, data: { name?: string }) => {
    return prisma.user.update({ where: { id }, data, select: safeSelect });
  },

  updateRole: (id: string, role: UserRole) => {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: safeSelect,
    });
  },
};
