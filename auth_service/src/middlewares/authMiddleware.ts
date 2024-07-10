import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: "Invalid token" });
    }
};
