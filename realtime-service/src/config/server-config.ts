import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const WS_PORT = process.env.WS_PORT;

export default {
    PORT,
    JWT_SECRET_KEY,
    WS_PORT,
};
