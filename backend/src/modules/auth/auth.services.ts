import { CustomError } from "../../common/utils/CustomError";
import bcrypt from "bcrypt";
import * as authType from "./auth.types";
import * as authModel from "./auth.models";

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