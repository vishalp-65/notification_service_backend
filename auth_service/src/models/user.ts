import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interface for user document

interface UserType extends Document {
    id: string;
    username: string;
    email: string;
    password: string;
    role: "user" | "admin";
    connected: boolean;
    comparePassword(password: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<UserType>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minLength: 7,
            required: true,
            match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/,
        },
        role: {
            type: String,
            required: true,
            default: "user",
            enum: ["user", "admin"],
        },
        connected: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Middleware to hash password before saving

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Function to compare password
userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const User = model<UserType>("User", userSchema);
export default User;
