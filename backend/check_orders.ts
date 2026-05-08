
import { PrismaClient } from './generated/prisma';
const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany();
    console.log('Total orders:', orders.length);
    const nullKeys = orders.filter(o => !o.idempotency_key);
    console.log('Orders with null/empty idempotency_key:', nullKeys.length);
    if (nullKeys.length > 0) {
        console.log('First 5:', nullKeys.slice(0, 5));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
