import { Request, Response } from "express";
import logger from "../../common/utils/logger";
import { CustomError } from "../../common/utils/CustomError";
import * as orderServices from "./order.services";

export const placeOrder = async (req: Request, res: Response) => {
    if (!req.user || !req.body) {
        throw new CustomError("Bad Request", 400);
    }
    const order = await orderServices.placeOrder(req.user.user_id, req.body);
    res.status(201).json(order);
    logger.info("Order placed successfully", {
        meta: {
            user_id: req.user?.user_id,
            service: "order-place",
            method: req.method,
            url: req.url,
        }
    })
}