
import "dotenv/config";
import { prisma } from "./src/common/utils/prisma";
import * as orderServices from "./src/modules/order/order.services";

async function repro() {
  console.log("Starting repro...");
  const userId = "ea7d1810-bfa0-43b1-b18f-506e2562e6c4"; // admin
  const productId = "5262eb36-d03a-4518-81fe-cf2069272b1a"; // Roblox Gift Card (19900)
  
  const quantity = 1000;
  const totalAmount = 19900 * quantity;
  
  console.log(`Attempting to place order for ${quantity} items, total amount: ${totalAmount}`);
  
  try {
    const result = await orderServices.placeOrder(userId, {
      user_id: userId,
      items: [{ product_id: productId, quantity }],
      total_amount: totalAmount
    });
    console.log("Order result:", result);
  } catch (error: any) {
    console.log(`Caught Error: ${error.message} (${error.statusCode})`);
  }
  
  console.log("Checking for PENDING orders...");
  const orders = await prisma.order.findMany({
    where: {
      user_id: userId,
      status: "PENDING"
    }
  });
  
  if (orders.length > 0) {
    console.log("ZOMBIE ORDERS FOUND!");
    console.log(JSON.stringify(orders, null, 2));
  } else {
    console.log("No Zombie Orders found.");
  }
}

repro()
  .then(() => console.log("Finished repro."))
  .catch((e) => console.error("Repro failed with error:", e))
  .finally(async () => {
    console.log("Disconnecting prisma...");
    await prisma.$disconnect();
  });
