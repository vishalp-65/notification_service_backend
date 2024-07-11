import Notification from "../models/notification";
import { ApolloError } from "apollo-server-express";

const resolvers = {
    Query: {
        notifications: async (
            _: any,
            { page = 1, limit = 10 }: { page: number; limit: number },
            { user }: { user: { id: string } }
        ) => {
            try {
                if (!user) {
                    throw new ApolloError("Unauthorized", "UNAUTHORIZED");
                }

                const notifications = await Notification.find({
                    userId: user.id,
                })
                    .skip((page - 1) * limit)
                    .limit(limit);

                return notifications;
            } catch (error) {
                throw new ApolloError(
                    "Failed to fetch notifications",
                    "DATABASE_ERROR",
                    {
                        error,
                    }
                );
            }
        },
        notification: async (_: any, { id }: { id: string }) => {
            try {
                const notification = await Notification.findOne({ id: id });
                if (!notification) {
                    throw new ApolloError(
                        "Notification not found",
                        "NOT_FOUND"
                    );
                }
                return notification;
            } catch (error) {
                console.error("Error fetching notification:", error);
                throw new ApolloError(
                    "Failed to fetch notification",
                    "DATABASE_ERROR",
                    {
                        error,
                    }
                );
            }
        },
    },
    Mutation: {
        createNotification: async (
            _: any,
            { message }: { message: string },
            { user }: { user: { id: string } }
        ) => {
            try {
                if (!user) {
                    throw new ApolloError("Unauthorized", "UNAUTHORIZED");
                }

                const notification = new Notification({
                    userId: user.id,
                    message,
                });
                await notification.save();

                // TODO: Add Kafka producer logic here

                return notification;
            } catch (error) {
                console.error("Error creating notification:", error);
                throw new ApolloError(
                    "Failed to create notification",
                    "DATABASE_ERROR",
                    {
                        error,
                    }
                );
            }
        },
        markNotificationAsRead: async (_: any, { id }: { id: string }) => {
            try {
                const notification = await Notification.findOneAndUpdate(
                    { id: id },
                    { read: true },
                    { new: true }
                );
                if (!notification) {
                    throw new ApolloError(
                        "Notification not found",
                        "NOT_FOUND"
                    );
                }
                return notification;
            } catch (error) {
                console.error("Error marking notification as read:", error);
                throw new ApolloError(
                    "Failed to mark notification as read",
                    "DATABASE_ERROR",
                    {
                        error,
                    }
                );
            }
        },
    },
};

export default resolvers;
