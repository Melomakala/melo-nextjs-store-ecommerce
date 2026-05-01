-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WalletTopup" (
    "topup_id" TEXT NOT NULL PRIMARY KEY,
    "wallet_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WalletTopup_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WalletTopup_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "WalletTransaction" ("transaction_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WalletTopup" ("amount", "created_at", "fee", "method", "status", "topup_id", "transaction_id", "wallet_id") SELECT "amount", "created_at", "fee", "method", "status", "topup_id", "transaction_id", "wallet_id" FROM "WalletTopup";
DROP TABLE "WalletTopup";
ALTER TABLE "new_WalletTopup" RENAME TO "WalletTopup";
CREATE UNIQUE INDEX "WalletTopup_transaction_id_key" ON "WalletTopup"("transaction_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
