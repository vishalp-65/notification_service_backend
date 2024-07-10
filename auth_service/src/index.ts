import express, { json, urlencoded } from "express";
import { DatabaseConfig, ServerConfig } from "./config/index.js";

const app = express();
app.use(json());

app.use(urlencoded({ extended: true }));

app.listen(ServerConfig.PORT, async () => {
    console.log(
        `Successfully started the server on PORT : ${ServerConfig.PORT}`
    );
    await DatabaseConfig.connectDB();
    console.log("MongoDB database connect");
});
