import express from "express";
import { json, urlencoded } from "express";
import { ServerConfig, DatabaseConfig } from "./config/index";
import {
    broadcastNotification,
    startWebSocketServer,
} from "./controllers/realtimeController";
import { connectConsumer, initKafkaConsumer } from "./config/kafka";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const startServer = async () => {
    // Connect to MongoDB
    await DatabaseConfig.connectDB();

    await connectConsumer();
    await initKafkaConsumer((message) => {
        broadcastNotification(message);
    });

    app.listen(ServerConfig.PORT, () => {
        console.log(`Server running on port ${ServerConfig.PORT}`);
        startWebSocketServer();
    });
};

startServer();
