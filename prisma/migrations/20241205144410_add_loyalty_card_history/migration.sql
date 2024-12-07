-- CreateTable
CREATE TABLE "LoyaltyCardHistory" (
    "id" SERIAL NOT NULL,
    "loyaltyCardId" INTEGER NOT NULL,
    "stampsAdded" INTEGER NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoyaltyCardHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoyaltyCardHistory" ADD CONSTRAINT "LoyaltyCardHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyCardHistory" ADD CONSTRAINT "LoyaltyCardHistory_loyaltyCardId_fkey" FOREIGN KEY ("loyaltyCardId") REFERENCES "LoyaltyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
