-- Check if tables already exist and handle accordingly

-- 1. Handle LPPosition.walletId column
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

-- 2. Create MonitoredWallet table if it doesn't exist
CREATE TABLE IF NOT EXISTS "MonitoredWallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MonitoredWallet_pkey" PRIMARY KEY ("id")
);

-- 3. Create HedgePosition table if it doesn't exist
CREATE TABLE IF NOT EXISTS "HedgePosition" (
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

-- 4. Create HedgeSnapshot table if it doesn't exist
CREATE TABLE IF NOT EXISTS "HedgeSnapshot" (
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

-- 5. Create RebalanceHistory table if it doesn't exist
CREATE TABLE IF NOT EXISTS "RebalanceHistory" (
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

-- 6. Create PositionSnapshotEnhanced table if it doesn't exist
CREATE TABLE IF NOT EXISTS "PositionSnapshotEnhanced" (
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

-- Create indexes if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS "MonitoredWallet_address_key" ON "MonitoredWallet"("address");
CREATE INDEX IF NOT EXISTS "MonitoredWallet_isActive_idx" ON "MonitoredWallet"("isActive");
CREATE INDEX IF NOT EXISTS "MonitoredWallet_address_idx" ON "MonitoredWallet"("address");
CREATE INDEX IF NOT EXISTS "HedgePosition_walletAddress_idx" ON "HedgePosition"("walletAddress");
CREATE INDEX IF NOT EXISTS "HedgePosition_walletId_idx" ON "HedgePosition"("walletId");
CREATE INDEX IF NOT EXISTS "HedgePosition_asset_idx" ON "HedgePosition"("asset");
CREATE INDEX IF NOT EXISTS "HedgePosition_isActive_idx" ON "HedgePosition"("isActive");
CREATE INDEX IF NOT EXISTS "HedgeSnapshot_hedgePositionId_idx" ON "HedgeSnapshot"("hedgePositionId");
CREATE INDEX IF NOT EXISTS "HedgeSnapshot_timestamp_idx" ON "HedgeSnapshot"("timestamp");
CREATE INDEX IF NOT EXISTS "RebalanceHistory_walletAddress_idx" ON "RebalanceHistory"("walletAddress");
CREATE INDEX IF NOT EXISTS "RebalanceHistory_timestamp_idx" ON "RebalanceHistory"("timestamp");
CREATE UNIQUE INDEX IF NOT EXISTS "PositionSnapshotEnhanced_snapshotId_key" ON "PositionSnapshotEnhanced"("snapshotId");
CREATE INDEX IF NOT EXISTS "PositionSnapshotEnhanced_snapshotId_idx" ON "PositionSnapshotEnhanced"("snapshotId");
CREATE INDEX IF NOT EXISTS "PositionSnapshotEnhanced_hedgePositionId_idx" ON "PositionSnapshotEnhanced"("hedgePositionId");
CREATE INDEX IF NOT EXISTS "LPPosition_walletId_idx" ON "LPPosition"("walletId");

-- Add foreign keys if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'LPPosition_walletId_fkey'
    ) THEN
        ALTER TABLE "LPPosition" ADD CONSTRAINT "LPPosition_walletId_fkey" 
        FOREIGN KEY ("walletId") REFERENCES "MonitoredWallet"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'HedgePosition_walletId_fkey'
    ) THEN
        ALTER TABLE "HedgePosition" ADD CONSTRAINT "HedgePosition_walletId_fkey" 
        FOREIGN KEY ("walletId") REFERENCES "MonitoredWallet"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'HedgeSnapshot_hedgePositionId_fkey'
    ) THEN
        ALTER TABLE "HedgeSnapshot" ADD CONSTRAINT "HedgeSnapshot_hedgePositionId_fkey" 
        FOREIGN KEY ("hedgePositionId") REFERENCES "HedgePosition"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;