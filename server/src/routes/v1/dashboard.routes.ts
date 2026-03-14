import { Router } from "express";
import { getDashboardStats } from "../../controllers/v1/dashboard.controller";

const router = Router();

router.get("/", getDashboardStats);

export { router as DashboardRoute };
