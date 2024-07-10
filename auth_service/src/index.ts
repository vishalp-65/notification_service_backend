import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig } from "./config";
import bodyParser from "body-parser";
import { register, login } from "./controllers/authController";
import { authenticateJWT } from "./middlewares/authMiddleware";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema/authSchema";
import resolvers from "./resolvers/authResolver";
import jwt from "jsonwebtoken";

const app = express();
app.use(json());
app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));

// REST API routes
app.post("/api/register", register);
app.post("/api/login", login);

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            // Extract token from headers and add it to context
            const token = req.headers.authorization || "";
            if (token) {
                try {
                    const decoded = jwt.verify(
                        token.split(" ")[1],
                        ServerConfig.JWT_SECRET_KEY as string
                    );
                    return { user: decoded };
                } catch (err) {
                    console.warn("Invalid token");
                }
            }
            return { user: null };
        },
    });

    await server.start();
    server.applyMiddleware({ app });

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

export default app;
