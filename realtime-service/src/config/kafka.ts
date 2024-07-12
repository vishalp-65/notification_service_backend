import fs from "fs";
import path from "path";
import { Consumer, Kafka } from "kafkajs";
import { ServerConfig } from "./index";

let consumer: Consumer | undefined;
let kafka: Kafka | undefined;

async function connectConsumer() {
    try {
        kafka = new Kafka({
            clientId: "notification-service",
            brokers: [ServerConfig.KAFKA_BROKERS as string],
            ssl: {
                ca: [
                    fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8"),
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
    } catch (error) {
        console.log("Kafka connection failed");
    }
}
consumer = kafka?.consumer({ groupId: "notification-service" });

async function initKafkaConsumer(
    broadcastNotification: (message: any) => void
) {
    try {
        await consumer?.connect();
        await consumer?.subscribe({
            topics: ["notification"],
            fromBeginning: true,
        });
        await consumer?.run({
            autoCommit: false,
            eachBatch: async function ({
                batch,
                heartbeat,
                commitOffsetsIfNecessary,
                resolveOffset,
            }) {
                const messages = batch.messages;
                console.log(`Recevied ${messages.length} messages..`);
                for (const message of messages) {
                    if (!message.value) continue;
                    const stringMessage = message.value.toString();
                    const parsedMessage = JSON.stringify(stringMessage);

                    broadcastNotification(parsedMessage);

                    resolveOffset(message.offset);
                    await commitOffsetsIfNecessary({
                        topics: [
                            {
                                topic: batch.topic,
                                partitions: [
                                    {
                                        partition: batch.partition,
                                        offset: (
                                            Number(message.offset) + 1
                                        ).toString(),
                                    },
                                ],
                            },
                        ],
                    });
                    await heartbeat();
                }
            },
        });
    } catch (error) {
        console.log(error, "error occured with kafka connection");
    }
}

export { initKafkaConsumer, connectConsumer };
