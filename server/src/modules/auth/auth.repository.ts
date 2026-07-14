import { prisma } from "../../infrastructure/database/prisma.client.js";

export const authRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  create: (data: { name: string; email: string; passwordHash: string }) => {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        provider: "local",
      },
    });
  },

  findById: (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },
};
