import { prisma } from "../../common/utils/prisma";

export const getWalletModel = async (user_id: string) => {
    return await prisma.wallet.findUnique({
        where: { user_id },
        select: {
            balance: true,
        }
    });
}