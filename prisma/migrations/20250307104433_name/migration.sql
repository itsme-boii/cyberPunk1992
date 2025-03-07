-- CreateTable
CREATE TABLE "predicateEntry" (
    "id" SERIAL NOT NULL,
    "sellerId" TEXT NOT NULL,
    "predicateId" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,

    CONSTRAINT "predicateEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "predicateEntry_predicateId_key" ON "predicateEntry"("predicateId");
