-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('PDF', 'COURSE', 'VIDEO', 'EBOOK', 'LINK');

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "benefits" JSONB;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'PDF',
ADD COLUMN     "modules" JSONB;

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Progress_wallet_idx" ON "Progress"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_wallet_contentId_key" ON "Progress"("wallet", "contentId");
