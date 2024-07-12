import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig, GraphqlConfig } from "./config";
import notificationRoutes from "./routes/notificationRoutes";
import { authenticateJWT } from "./middlewares/authMiddleware";
import connectProducer from "./config/kafkaConfig";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

// Setup Apollo Server with Express
const startServer = async () => {
    // Start appolo server
    await GraphqlConfig.server.start();
    GraphqlConfig.server.applyMiddleware({ app });

    // Apply middleware for protected routes after Apollo middleware
    app.use(authenticateJWT);

    await connectProducer();

    // REST API routes
    app.use("/api", notificationRoutes);

    await DatabaseConfig.connectDB();
    //   await connectKafka();

    app.listen(ServerConfig.PORT, () => {
        console.log(`Server running on PORT: ${ServerConfig.PORT}`);
    });
};

startServer();
