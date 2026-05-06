
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from './generated/prisma';

const connectionString = `${process.env.DATABASE_URL || 'file:./dev.db'}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({ include: { wallet: true } });
  const products = await prisma.product.findMany();
  
  console.log('--- Users & Wallets ---');
  console.log(JSON.stringify(users, null, 2));
  
  console.log('\n--- Products ---');
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
