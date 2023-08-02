-- CreateTable
CREATE TABLE "SocialLogin" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SocialLogin_pkey" PRIMARY KEY ("id")
);
