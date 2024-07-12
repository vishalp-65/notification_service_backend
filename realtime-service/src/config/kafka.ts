import { Kafka, Consumer } from "kafkajs";

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: [process.env.KAFKA_BROKER as string],
});

const consumer: Consumer = kafka.consumer({ groupId: "notification-group" });

const connectConsumer = async () => {
    await consumer.connect();
    console.log("Connected to Kafka");
};

const subscribeToTopic = async (topic: string) => {
    await consumer.subscribe({ topic, fromBeginning: true });
};

const runConsumer = async (callback: (message: any) => void) => {
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const parsedMessage = JSON.parse(message.value?.toString() || "{}");
            callback(parsedMessage);
        },
    });
};

export { connectConsumer, subscribeToTopic, runConsumer };
