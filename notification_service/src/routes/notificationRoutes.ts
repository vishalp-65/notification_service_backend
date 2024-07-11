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
router.post("/api/notifications", authenticateJWT, createNotification);
router.get("/api/notifications", authenticateJWT, getNotifications);
router.get("/api/notifications/:id", authenticateJWT, getNotificationById);
router.put("/api/notifications/:id", authenticateJWT, markNotificationAsRead);

export default router;
