import fs from "fs";
import path from "path";
import { Kafka, Producer } from "kafkajs";
import { ServerConfig } from "./index";

let producer: Producer | undefined;

export default async function connectProducer() {
    try {
        const kafka = new Kafka({
            clientId: "notification-service",
            brokers: [ServerConfig.KAFKA_BROKERS as string],
            ssl: {
                ca: [
                    fs.readFileSync(
                        path.join(__dirname, "../../kafka.pem"),
                        "utf-8"
                    ),
                ],
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

        producer = kafka.producer();
        await producer.connect();
        console.log("Kafka producer connected");
    } catch (error) {
        console.log("Error connecting Kafka producer", error);
    }
}

async function sendMessage(topic: string, message: any) {
    try {
        await producer?.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Message sent to topic ${topic}:`, message);
    } catch (error) {
        console.error("Error sending message to Kafka topic", error);
    }
}

export { sendMessage };
