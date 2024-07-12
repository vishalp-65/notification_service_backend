import { Request, Response } from "express";
import Notification from "../models/notification";
import { sendMessage } from "../config/kafkaConfig";
// import producer from "../config/kafkaConfig";

interface CustomRequest extends Request {
    user?: any;
}

export const createNotification = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const { message } = req.body;
    const userId = req.user.id;

    try {
        const notification = new Notification({ userId, message });
        await notification.save();

        // Add kafka producer
        await sendMessage("notification", notification);

        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getNotifications = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const userId = req.user.id;

    // Setting default page number and limit
    const { page = "1", limit = "10" } = req.query;

    try {
        // Converting page and limit to number
        const parsedPage = parseInt(page as string);
        const parsedLimit = parseInt(limit as string);

        if (isNaN(parsedPage) || isNaN(parsedLimit)) {
            res.status(400).json({ message: "Invalid query parameters" });
            return;
        }

        const notifications = await Notification.find({ userId })
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getNotificationById = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const markNotificationAsRead = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    try {
        const notification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );
        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
