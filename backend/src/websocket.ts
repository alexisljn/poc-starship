import {Server as HttpServer} from "http";
import {Server} from "socket.io";
import {addToStore, clearStore, getStore} from "./store";
import {PaintCoords} from "./types";

export default (httpServer: HttpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected: ', socket.id);

        socket.emit("init", getStore());

        socket.on("paint", (coords: PaintCoords) => {
            addToStore(coords);

            socket.broadcast.emit("update", coords);
        })

        socket.on("clear", () => {
            clearStore();

            io.emit("reset", getStore());
        })

        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
        });
    });
}