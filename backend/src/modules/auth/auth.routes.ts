import { Router } from "express";
import * as AuthController from "./auth.controllers";
import { validate } from "../../common/middleware/validate";
import * as AuthSchema from "./auth.schema";

const router = Router();

router.post("/auth/register", validate(AuthSchema.registerSchema), AuthController.register);

router.post("/auth/login", validate(AuthSchema.loginSchema), AuthController.login);

export default router