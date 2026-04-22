import { CustomError } from "../../common/utils/CustomError";
import bcrypt from "bcrypt";
import * as authType from "./auth.types";
import * as authModel from "./auth.models";
import * as Jwt from "../../common/utils/jwt";

export const registerService = async (data: authType.registerRequest): Promise<authType.registerResponse> => {
    const { email, password, name } = data;
    const userExists = await authModel.findUserByEmail(email);
    if (userExists) {
        throw new CustomError("User already exists", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword, name }
    const result = await authModel.createUser(user)
    return result;
}

export const loginService = async (data: authType.loginRequest): Promise<authType.loginResponse> => {
    const { email, password } = data;
    const user = await authModel.findUserByEmail(email);
    if (!user) {
        throw new CustomError("User not found", 404);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new CustomError("Invalid password", 401);
    }
    const token = Jwt.genAccessToken({
        user_id: user.user_id,
        email: user.email,
    });

    const refreshToken = Jwt.genRefreshToken({
        user_id: user.user_id,
        email: user.email,
    });
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    const ChkRefreshToken = await authModel.findRefreshToken(user.user_id);
    if (!ChkRefreshToken) {
        await authModel.createRefreshToken(user.user_id, hashRefreshToken);
    } else {
        await authModel.updateRefreshToken(ChkRefreshToken.refreshtoken_id, hashRefreshToken);
    }
    return {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email,
        token: token,
        refreshToken: refreshToken,
    };
}

export const refreshTokenService = async (data: authType.refreshTokenRequest): Promise<authType.refreshTokenResponse> => {
    const { user_id, email } = data;
    const token = Jwt.genAccessToken({
        user_id: user_id,
        email: email,
    });
    if (!token) {
        throw new CustomError("Token not generated", 500);
    }
    return {
        token: token,
    };
}