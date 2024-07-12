import express from "express";
import { Server } from "socket.io";
import http from "http";
import consumer from "./config/kafka";
import { authenticateJWT } from "./middlewares/authMiddleware";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.use(authenticateJWT);

io.on("connection", (socket) => {
    console.log("New client connected");

    consumer.on("message", (message) => {
        socket.emit("notification", message);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

export default server;
