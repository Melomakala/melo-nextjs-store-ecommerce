import { prisma } from "../../common/utils/prisma";
import * as authType from "./auth.types";

export const createUser = async (data: authType.registerRequest): Promise<authType.registerResponse> => {
    return await prisma.user.create({
        data,
        select: {
            user_id: true,
            name: true,
            email: true
        }
    });
}

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
}