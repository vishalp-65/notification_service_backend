import { Request, Response, NextFunction } from "express";
import { ServerConfig } from "../config";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: any;
}

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
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};
