import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;
const WS_PORT = process.env.WS_PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const KAFKA_BROKERS = process.env.KAFKA_BROKERS;
const KAFKA_TOPICS = process.env.KAFKA_TOPICS;
const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD;

export default {
    PORT,
    DB_URI,
    WS_PORT,
    JWT_SECRET_KEY,
    KAFKA_BROKERS,
    KAFKA_TOPICS,
    KAFKA_PASSWORD,
};
