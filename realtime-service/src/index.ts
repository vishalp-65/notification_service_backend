import express from "express";
import { json, urlencoded } from "express";
import { ServerConfig, DatabaseConfig } from "./config/index";
import { startWebSocketServer } from "./controllers/realtimeController";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

const startServer = async () => {
    // Connect to MongoDB
    await DatabaseConfig.connectDB();

    app.listen(ServerConfig.PORT, () => {
        console.log(`Server running on port ${ServerConfig.PORT}`);
        startWebSocketServer();
    });
};

startServer();
