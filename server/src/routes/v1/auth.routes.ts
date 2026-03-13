import { Router } from "express";
import {
    backup2fa,
    confirm2fa,
    disable2fa,
    init2fa,
    login,
    register,
    verify2fa,
} from "../../controllers/v1/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/2fa/init", init2fa);
router.post("/2fa/confirm", confirm2fa);
router.post("/2fa/verify", verify2fa);
router.post("/2fa/backup", backup2fa);
router.delete("/2fa", disable2fa);

export { router as AuthRoute };

