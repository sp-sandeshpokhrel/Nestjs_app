-- AlterTable
ALTER TABLE "SocialLogin" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[];
