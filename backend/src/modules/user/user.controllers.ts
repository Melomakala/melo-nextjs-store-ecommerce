import { Request, Response } from "express";
import * as userServices from "./user.services";
import logger from "../../common/utils/logger";
import { CustomError } from "../../common/utils/CustomError";

export const getProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new CustomError("User not found", 404);
    }
    const user = await userServices.getProfileService(req.user.user_id);
    res.status(200).json({
        message: "User",
        data: user
    });
    logger.info("Get Profile Success", {
        meta: {
            user_id: req.user?.user_id,
            service: "user-get-profile",
            method: req.method,
            url: req.url,
        }
    })
}