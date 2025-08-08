-- AlterTable (conditionally add walletId if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'LPPosition' 
        AND column_name = 'walletId'
    ) THEN
        ALTER TABLE "LPPosition" ADD COLUMN "walletId" TEXT;
    END IF;
END $$;

-- CreateTable
CREATE TABLE "MonitoredWallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoredWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HedgePosition" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "walletId" TEXT,
    "asset" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "notionalValue" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "markPrice" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "leverage" DOUBLE PRECISION NOT NULL,
    "unrealizedPnl" DOUBLE PRECISION NOT NULL,
    "realizedPnl" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fundingPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentFundingRate" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HedgePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HedgeSnapshot" (
    "id" TEXT NOT NULL,
    "hedgePositionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" DOUBLE PRECISION NOT NULL,
    "markPrice" DOUBLE PRECISION NOT NULL,
    "notionalValue" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "unrealizedPnl" DOUBLE PRECISION NOT NULL,
    "fundingRate" DOUBLE PRECISION NOT NULL,
    "fundingPaid" DOUBLE PRECISION NOT NULL,
    "deltaExposure" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HedgeSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RebalanceHistory" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deltaDriftBefore" DOUBLE PRECISION NOT NULL,
    "targetDelta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lpAdjustmentType" TEXT,
    "lpTokensAdded0" DOUBLE PRECISION,
    "lpTokensAdded1" DOUBLE PRECISION,
    "lpTokensRemoved0" DOUBLE PRECISION,
    "lpTokensRemoved1" DOUBLE PRECISION,
    "hedgeAdjustmentType" TEXT,
    "hedgeSizeBefore" DOUBLE PRECISION,
    "hedgeSizeAfter" DOUBLE PRECISION,
    "hedgePrice" DOUBLE PRECISION,
    "deltaDriftAfter" DOUBLE PRECISION NOT NULL,
    "totalCostUSD" DOUBLE PRECISION NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,

    CONSTRAINT "RebalanceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionSnapshotEnhanced" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "impermanentLoss" DOUBLE PRECISION NOT NULL,
    "impermanentLossPercent" DOUBLE PRECISION NOT NULL,
    "deltaExposure" DOUBLE PRECISION NOT NULL,
    "hedgePositionId" TEXT,
    "hedgeSize" DOUBLE PRECISION,
    "netDelta" DOUBLE PRECISION NOT NULL,
    "hedgeEffectiveness" DOUBLE PRECISION,
    "lpFeesEarned" DOUBLE PRECISION NOT NULL,
    "fundingEarned" DOUBLE PRECISION NOT NULL,
    "netPnl" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PositionSnapshotEnhanced_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonitoredWallet_address_key" ON "MonitoredWallet"("address");

-- CreateIndex
CREATE INDEX "MonitoredWallet_isActive_idx" ON "MonitoredWallet"("isActive");

-- CreateIndex
CREATE INDEX "MonitoredWallet_address_idx" ON "MonitoredWallet"("address");

-- CreateIndex
CREATE INDEX "HedgePosition_walletAddress_idx" ON "HedgePosition"("walletAddress");

-- CreateIndex
CREATE INDEX "HedgePosition_walletId_idx" ON "HedgePosition"("walletId");

-- CreateIndex
CREATE INDEX "HedgePosition_asset_idx" ON "HedgePosition"("asset");

-- CreateIndex
CREATE INDEX "HedgePosition_isActive_idx" ON "HedgePosition"("isActive");

-- CreateIndex
CREATE INDEX "HedgeSnapshot_hedgePositionId_idx" ON "HedgeSnapshot"("hedgePositionId");

-- CreateIndex
CREATE INDEX "HedgeSnapshot_timestamp_idx" ON "HedgeSnapshot"("timestamp");

-- CreateIndex
CREATE INDEX "RebalanceHistory_walletAddress_idx" ON "RebalanceHistory"("walletAddress");

-- CreateIndex
CREATE INDEX "RebalanceHistory_timestamp_idx" ON "RebalanceHistory"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "PositionSnapshotEnhanced_snapshotId_key" ON "PositionSnapshotEnhanced"("snapshotId");

-- CreateIndex
CREATE INDEX "PositionSnapshotEnhanced_snapshotId_idx" ON "PositionSnapshotEnhanced"("snapshotId");

-- CreateIndex
CREATE INDEX "PositionSnapshotEnhanced_hedgePositionId_idx" ON "PositionSnapshotEnhanced"("hedgePositionId");

-- CreateIndex
CREATE INDEX "LPPosition_walletId_idx" ON "LPPosition"("walletId");

-- AddForeignKey
ALTER TABLE "LPPosition" ADD CONSTRAINT "LPPosition_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "MonitoredWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HedgePosition" ADD CONSTRAINT "HedgePosition_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "MonitoredWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HedgeSnapshot" ADD CONSTRAINT "HedgeSnapshot_hedgePositionId_fkey" FOREIGN KEY ("hedgePositionId") REFERENCES "HedgePosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;