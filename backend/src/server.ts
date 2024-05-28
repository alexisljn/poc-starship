import express from "express";
import {createServer} from "http";
import websocket from "./websocket";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const httpServer = createServer(app);

const port = process.env.PORT || 3000;

websocket(httpServer);

app.get('/', (req, res) => {
    res.status(200).end();
})

httpServer.listen(port, () => {
    console.log(`POC Starship is listening on port:${port}`)
})