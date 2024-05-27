import {Server as HttpServer} from "http";
import {Server} from "socket.io";

export default (httpServer: HttpServer) => {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    })

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}