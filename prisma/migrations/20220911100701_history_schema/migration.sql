-- CreateTable
CREATE TABLE "histories" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "keywordId" INTEGER NOT NULL,

    CONSTRAINT "histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_results" (
    "id" SERIAL NOT NULL,
    "href" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "breadcrumb" TEXT,
    "content" JSONB NOT NULL,
    "hasReviews" BOOLEAN NOT NULL,
    "historyId" INTEGER NOT NULL,

    CONSTRAINT "search_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "keywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_results" ADD CONSTRAINT "search_results_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
