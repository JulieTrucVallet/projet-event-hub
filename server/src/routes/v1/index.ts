import { Router } from "express";
import { AuthRoute } from "./auth.routes";
import { DashboardRoute } from "./dashboard.routes";
import { EventRoute } from "./event.routes";
import { UsersRoute } from "./users.routes";

const router = Router();

router.use("/events", EventRoute);
router.use("/auth", AuthRoute);
router.use("/users", UsersRoute);
router.use("/dashboard", DashboardRoute);

export { router as v1Router };

