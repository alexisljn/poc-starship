import express from "express";
import {createServer} from "http";
import websocket from "./websocket";

const app = express();

const httpServer = createServer(app);

const port = 3000;

websocket(httpServer);

app.get('/', (req, res) => {
    res.status(200);
})

httpServer.listen(port, () => {
    console.log(`POC Starship is listening on port:${port}`)
})