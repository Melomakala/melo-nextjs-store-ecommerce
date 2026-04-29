import { CustomError } from "../../common/utils/CustomError";
import * as userModel from "./user.models";

export const getProfileService = async (user_id: string) => {
    const user = await userModel.getProfileModel(user_id);
    if (!user) {
        throw new CustomError("User not found", 404);
    }
    return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}