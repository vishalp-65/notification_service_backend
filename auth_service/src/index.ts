import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig } from "./config";
import { register, login } from "./controllers/authController";
import { authenticateJWT } from "./middlewares/authMiddleware";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema/authSchema";
import resolvers from "./resolvers/authResolver";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

// REST API routes
app.post("/api/register", register);
app.post("/api/login", login);

// Apply middleware for protected routes
app.use(authenticateJWT);

const startServer = async () => {
    // Setup Apollo Server with Express
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start(); // Ensure Apollo server is started before applying middleware
    server.applyMiddleware({ app });

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
