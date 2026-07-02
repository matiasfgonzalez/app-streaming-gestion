-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateTable
CREATE TABLE "RadioProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "hosts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "guests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadioSchedule" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "day" "Weekday" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isRerun" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RadioSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "audioUrl" TEXT,
    "youtubeId" TEXT,
    "coverUrl" TEXT,
    "programId" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RadioProgram_slug_key" ON "RadioProgram"("slug");

-- CreateIndex
CREATE INDEX "RadioProgram_active_order_idx" ON "RadioProgram"("active", "order");

-- CreateIndex
CREATE INDEX "RadioSchedule_programId_idx" ON "RadioSchedule"("programId");

-- CreateIndex
CREATE INDEX "RadioSchedule_day_startTime_idx" ON "RadioSchedule"("day", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_slug_key" ON "Podcast"("slug");

-- CreateIndex
CREATE INDEX "Podcast_publishedAt_idx" ON "Podcast"("publishedAt");

-- AddForeignKey
ALTER TABLE "RadioSchedule" ADD CONSTRAINT "RadioSchedule_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RadioProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RadioProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
