import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

/**
 * Controller to handle user registration.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ id: uuidv4(), username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Controller to handle user login.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
