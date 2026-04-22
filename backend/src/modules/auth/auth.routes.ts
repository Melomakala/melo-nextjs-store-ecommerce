import { Router } from "express";
import * as AuthController from "./auth.controllers";
import { validate } from "../../common/middleware/validate";
import * as AuthSchema from "./auth.schema";
import { authenticateRefreshToken } from "../../common/middleware/authenticate";

const router = Router();

router.post("/auth/register", validate(AuthSchema.registerSchema), AuthController.register);
router.post("/auth/login", validate(AuthSchema.loginSchema), AuthController.login);
router.post("/auth/refresh", authenticateRefreshToken, AuthController.refreshToken);
router.post("/auth/logout", authenticateRefreshToken, AuthController.logout);

export default router