/*
  Warnings:

  - The primary key for the `SocialLogin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `SocialLogin` table. All the data in the column will be lost.
  - Added the required column `id` to the `SocialLogin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SocialLogin" DROP CONSTRAINT "SocialLogin_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "SocialLogin_pkey" PRIMARY KEY ("id");
