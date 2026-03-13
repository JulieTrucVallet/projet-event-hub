import { Router } from "express";
import { getMe, updateMe } from "../../controllers/v1/user.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

export { router as UsersRoute };
