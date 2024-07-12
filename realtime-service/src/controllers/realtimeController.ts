import WebSocket from "ws";
import http from "http";
import { ServerConfig } from "../config";
import jwt from "jsonwebtoken";

const server = http.createServer();
const wss = new WebSocket.Server({ server });

interface CustomWebSocket extends WebSocket {
    userId?: string;
}

wss.on("connection", (ws: CustomWebSocket) => {
    console.log("Client connected");

    ws.on("message", (message: string) => {
        try {
            console.log(message);
            const { token } = JSON.parse(message);
            console.log(token);
            const decoded = jwt.verify(
                token,
                ServerConfig.JWT_SECRET_KEY as string
            ) as {
                id: string;
            };
            ws.userId = decoded.id;
            console.log(`User connected: ${ws.userId}`);
        } catch (error) {
            console.error("Invalid token");
            ws.close();
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

const broadcastNotification = (notification: any) => {
    wss.clients.forEach((client: CustomWebSocket) => {
        if (
            client.readyState === WebSocket.OPEN &&
            client.userId === notification.userId
        ) {
            client.send(JSON.stringify(notification));
        }
    });
};

const startWebSocketServer = async () => {
    server.listen(ServerConfig.WS_PORT, () => {
        console.log(`WebSocket server started on port ${ServerConfig.WS_PORT}`);
    });
};

export { startWebSocketServer, broadcastNotification };
