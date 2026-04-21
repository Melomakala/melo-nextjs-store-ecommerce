import { Router } from "express";
import * as AuthController from "./auth.controllers";
import { validate } from "../../common/middleware/validate";
import { registerSchema } from "./auth.schema";
const router = Router();

router.post("/auth/register", validate(registerSchema), AuthController.register);

router.post("/auth/login", AuthController.login);

export default router