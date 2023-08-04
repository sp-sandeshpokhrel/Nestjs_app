/*
  Warnings:

  - The primary key for the `SocialLogin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SocialLogin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialLogin" DROP CONSTRAINT "SocialLogin_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SocialLogin_pkey" PRIMARY KEY ("userId");
