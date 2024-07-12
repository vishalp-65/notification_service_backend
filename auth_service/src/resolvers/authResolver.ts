import User from "../models/user";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ServerConfig } from "../config";

// Define the type for the context argument
interface Context {
    id: string;
    username: string;
    email: string;
    password: string;
    role: "user" | "admin";
    connected: boolean;
}

interface LoginArgs {
    email: string;
    password: string;
}

interface RegisterArgs {
    username: string;
    email: string;
    password: string;
}

const resolvers = {
    Query: {
        // Get all users.

        users: async () => await User.find(),

        // Get user by ID.

        user: async (_: any, { id }: { id: string }) => await User.findById(id),
    },
    Mutation: {
        // Register a new user.

        register: async (
            _: any,
            { username, email, password }: RegisterArgs
        ) => {
            const newUser = new User({
                id: uuidv4(),
                username,
                email,
                password,
            });
            await newUser.save();
            return "User registered successfully";
        },

        // Login a user and return JWT.

        login: async (_: any, { email, password }: LoginArgs) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                throw new Error("Invalid credentials");
            }
            const token = jwt.sign(
                { id: user.id, role: user.role },
                ServerConfig.JWT_SECRET_KEY as string,
                { expiresIn: "7d" }
            );
            return token;
        },
    },
};

export default resolvers;
