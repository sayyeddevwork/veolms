import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/shared/helpers/password.helper.js";
import { UserRole } from "../src/shared/types/roles.js";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await hashPassword("Admin@123");
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isEmailVerified: true,
    },
  });

  const instructorPasswordHash = await hashPassword("Instructor@123");
  await prisma.user.upsert({
    where: { email: "instructor@example.com" },
    update: {},
    create: {
      name: "Demo Instructor",
      email: "instructor@example.com",
      passwordHash: instructorPasswordHash,
      role: UserRole.INSTRUCTOR,
      isEmailVerified: true,
    },
  });

  const studentPasswordHash = await hashPassword("Student@123");
  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@example.com",
      passwordHash: studentPasswordHash,
      role: UserRole.STUDENT,
      isEmailVerified: true,
    },
  });

  console.log("Seed complete:");
  console.log("  Admin:      admin@example.com / Admin@123");
  console.log("  Instructor: instructor@example.com / Instructor@123");
  console.log("  Student:    student@example.com / Student@123");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
