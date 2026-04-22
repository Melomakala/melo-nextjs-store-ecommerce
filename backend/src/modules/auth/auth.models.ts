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

export const updateRefreshToken = async (refreshtoken_id: string, refreshToken: string) => {
    return await prisma.refreshToken.update({
        where: { refreshtoken_id },
        data: {
            token_hash: refreshToken,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            created_at: new Date(),
            revoked_at: null,
        }
    });
}

export const createRefreshToken = async (user_id: string, refreshToken: string) => {
    return await prisma.refreshToken.create({
        data: {
            user_id,
            token_hash: refreshToken,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
            created_at: new Date(),
            revoked_at: null,
        }
    });
}

export const findRefreshToken = async (user_id: string) => {
    return await prisma.refreshToken.findUnique({ where: { user_id } });
}

export const revokeRefreshToken = async (user_id: string) => {
    return await prisma.refreshToken.update({
        where: { user_id, revoked_at: null },
        data: {
            revoked_at: new Date(),
        }
    });
}