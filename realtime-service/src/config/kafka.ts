import fs from "fs";
import path from "path";
import { Consumer, Kafka, EachBatchPayload } from "kafkajs";
import { ServerConfig } from "./index";

let consumer: Consumer;
let kafka: Kafka;

async function connectConsumer() {
    try {
        kafka = new Kafka({
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
        console.log("Kafka connected");
    } catch (error) {
        console.error("Kafka connection failed", error);
    }
}

async function initKafkaConsumer(
    broadcastNotification: (message: any) => void
) {
    if (!kafka) {
        await connectConsumer();
    }

    try {
        consumer = kafka.consumer({ groupId: "notification-service" });
        await consumer.connect();
        console.log("Kafka consumer connected");

        await consumer.subscribe({
            topic: "notification",
            fromBeginning: true,
        });
        console.log("Kafka consumer subscribed to topic");

        await consumer.run({
            autoCommit: false,
            eachBatch: async ({
                batch,
                heartbeat,
                commitOffsetsIfNecessary,
                resolveOffset,
            }: EachBatchPayload) => {
                console.log(
                    `Received batch of ${batch.messages.length} messages...`
                );

                for (const message of batch.messages) {
                    if (!message.value) continue;

                    const stringMessage = message.value.toString();
                    console.log(`Processing message: ${stringMessage}`);

                    try {
                        const parsedMessage = JSON.parse(stringMessage);
                        broadcastNotification(parsedMessage);
                    } catch (error) {
                        console.error("Error parsing message", error);
                    }

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
        console.error("Error occurred with Kafka consumer", error);
    }
}

export { initKafkaConsumer, connectConsumer };
