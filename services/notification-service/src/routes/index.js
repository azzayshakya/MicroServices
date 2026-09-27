import { Router } from "express";
import notificationRoutes from "./notification.routes.js";

const router = Router();

router.use("/notifications", notificationRoutes);

export default router;
