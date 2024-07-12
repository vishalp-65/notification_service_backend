import fs from "fs";
import path from "path";
import { Kafka } from "kafkajs";
import { ServerConfig } from "./index";

let kafka;

try {
    kafka = new Kafka({
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
} catch (error) {
    console.log("Kafka connection failed");
}

if (!kafka) {
    console.log("connection failed with kafka");
    return;
}

const producer = kafka?.consumer({groupId:});

export default producer;
