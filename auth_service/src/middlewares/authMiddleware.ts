import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ServerConfig } from "../config/index";

interface CustomRequest extends Request {
    user?: any;
}

/**
 * Middleware to authenticate user using JWT.
 */
export const authenticateJWT = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access denied, no token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            ServerConfig.JWT_SECRET_KEY as string
        );
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: "Invalid token" });
    }
};
