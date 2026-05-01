-- CreateTable
CREATE TABLE "WalletTransaction" (
    "transaction_id" TEXT NOT NULL PRIMARY KEY,
    "wallet_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "balance_before" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reference_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTransaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WalletTopup" (
    "topup_id" TEXT NOT NULL PRIMARY KEY,
    "wallet_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTopup_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WalletTopup_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "WalletTransaction" ("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_reference_id_key" ON "WalletTransaction"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTopup_transaction_id_key" ON "WalletTopup"("transaction_id");
