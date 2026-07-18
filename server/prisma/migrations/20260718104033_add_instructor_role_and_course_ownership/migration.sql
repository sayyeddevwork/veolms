/*
  Warnings:

  - Added the required column `instructorId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'INSTRUCTOR';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "instructorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Course_instructorId_idx" ON "Course"("instructorId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
