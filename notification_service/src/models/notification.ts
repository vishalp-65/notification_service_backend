import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface INotification extends Document {
    id: string;
    userId: string;
    message: string;
    read: boolean;
}

const notificationSchema = new Schema<INotification>({
    id: {
        type: String,
        default: uuidv4,
    },
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
