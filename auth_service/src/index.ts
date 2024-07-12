import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig, GraphqlConfig } from "./config";
import bodyParser from "body-parser";
import { register, login } from "./controllers/authController";
import { authenticateJWT } from "./middlewares/authMiddleware";

const app = express();
app.use(json());
app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));

// REST API routes
app.post("/api/register", register);
app.post("/api/login", login);

const startServer = async () => {
    // Connect appolo server
    await GraphqlConfig.server.start();
    GraphqlConfig.server.applyMiddleware({ app });

    // Apply middleware for protected routes after Apollo middleware
    app.use(authenticateJWT);

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
