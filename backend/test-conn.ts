
import "dotenv/config";
import { prisma } from "./src/common/utils/prisma";

async function main() {
  console.log("Checking DB connection...");
  try {
    const count = await prisma.user.count();
    console.log("User count:", count);
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
