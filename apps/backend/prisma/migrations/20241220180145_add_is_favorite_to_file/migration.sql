/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `File` table. All the data in the column will be lost.
  - Added the required column `category` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT', 'OTHER');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "thumbnail",
ADD COLUMN     "category" "FileCategory" NOT NULL,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT;
