/*
  Warnings:

  - You are about to drop the column `image` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `experience` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageFileId` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "image",
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "imageFileId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "joinedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
