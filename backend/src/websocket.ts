import {Server as HttpServer} from "http";
import {Server} from "socket.io";
import {store} from "./store";
import {PaintCoords} from "./types";

export default (httpServer: HttpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit("init", store);

        socket.on("paint", (coords: PaintCoords) => {
            store.push(coords);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}