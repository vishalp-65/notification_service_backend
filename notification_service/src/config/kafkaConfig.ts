import fs from "fs";
import path from "path";
import { Kafka } from "kafkajs";
import { ServerConfig } from "./index";

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: [ServerConfig.KAFKA_BROKERS as string],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
    },
    sasl: {
        username: "avnadmin",
        password: ServerConfig.KAFKA_PASSWORD as string,
        mechanism: "plain",
    },
    connectionTimeout: 100000,
    requestTimeout: 25000,
    retry: {
        initialRetryTime: 100,
        retries: 10,
    },
});

const producer = kafka.producer();

export default producer;
