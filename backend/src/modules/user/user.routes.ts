import { Router } from "express";
import { authenticateAccessToken } from "../../common/middleware/authenticate";
import * as userController from "./user.controllers";

const router = Router();

router.get("/user/profile", authenticateAccessToken, userController.getProfile);

export default router;