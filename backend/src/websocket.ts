import {Server as HttpServer} from "http";
import {Server} from "socket.io";
import {addToStore, clearStore, getStore} from "./store";
import {CellWithCanvasId} from "./types";

export default (httpServer: HttpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected: ', socket.id);

        socket.emit("init", getStore());

        socket.on("paint", (cellData: CellWithCanvasId) => {
            addToStore(cellData);

            socket.broadcast.emit("update", cellData);
        })

        socket.on("clear", (canvasId: string) => {
            clearStore(canvasId);

            io.emit("reset", canvasId);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
        });
    });
}