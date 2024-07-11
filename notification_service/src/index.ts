import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig } from "./config";
import notificationRoutes from "./routes/notificationRoutes";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schema/notificationSchema";
import resolvers from "./resolvers/notificationResolver";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "./middlewares/authMiddleware";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

// REST API routes
app.use("/api", notificationRoutes);

// Setup Apollo Server with Express
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

    await DatabaseConfig.connectDB();
    //   await connectKafka();

    app.listen(ServerConfig.PORT, () => {
        console.log(`Server running on PORT: ${ServerConfig.PORT}`);
    });
};

startServer();
