import { Router } from "express";
import {
    createNotification,
    getNotifications,
    getNotificationById,
    markNotificationAsRead,
} from "../controllers/notificationController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

// REST API routes
router.post("/notification", authenticateJWT, createNotification);
router.get("/notifications", authenticateJWT, getNotifications);
router.get("/notifications/:id", authenticateJWT, getNotificationById);
router.put("/notification/:id", authenticateJWT, markNotificationAsRead);

export default router;
