-- CreateTable
CREATE TABLE "MonthlyMetrics" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "dinheiro" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cartaoTef" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pitCard" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brasilCard" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "linkCartao" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pix" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cheque" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "crediario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyMetrics_month_year_key" ON "MonthlyMetrics"("month", "year");
