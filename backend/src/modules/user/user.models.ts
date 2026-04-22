import { prisma } from "../../common/utils/prisma";

export const getProfileModel = async (user_id: string) => {
    return await prisma.user.findUnique({
        where: { user_id },
        select: {
            user_id: true,
            name: true,
            email: true,
            role: true,
        }
    });
}