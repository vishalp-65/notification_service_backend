import ServerConfig from "./server-config";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "../schema/authSchema";
import resolvers from "../resolvers/authResolver";
import jwt from "jsonwebtoken";

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

export default { server };
