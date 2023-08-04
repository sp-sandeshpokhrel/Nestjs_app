/*
  Warnings:

  - You are about to drop the column `provider` on the `SocialLogin` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `SocialLogin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialLogin" DROP COLUMN "provider",
DROP COLUMN "providerId";
