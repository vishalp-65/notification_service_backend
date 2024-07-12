import mongoose from "mongoose";
import ServerConfig from "./server-config";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(ServerConfig.DB_URI as string);
        console.log("MongoDB connected");
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};

export default { connectDB };
