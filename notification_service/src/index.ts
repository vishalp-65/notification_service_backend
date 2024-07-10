import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig } from "./config";
import bodyParser from "body-parser";

const app = express();
app.use(json());
app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));

const startServer = async () => {
    // Connect to the database
    await DatabaseConfig.connectDB();
    console.log("MongoDB database connected");

    // Start Express server
    app.listen(ServerConfig.PORT, () => {
        console.log(
            `Successfully started the server on PORT: ${ServerConfig.PORT}`
        );
    });
};

startServer().catch((err) => {
    console.error("Failed to start server:", err);
});

export default app;
