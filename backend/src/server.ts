import express from "express";
import {createServer} from "http";
import websocket from "./websocket";


const app = express();

const httpServer = createServer(app);

const port = 3000;

websocket(httpServer);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})