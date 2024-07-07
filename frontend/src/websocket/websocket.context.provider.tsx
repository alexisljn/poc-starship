import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";

type WebSocketContextType = {
    socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null
});

export const useWebSocket = () => {
    return useContext(WebSocketContext).socket;
}

type WebSocketContextProviderProps = {
    children: ReactNode
}

export default function WebSocketContextProvider({children}: WebSocketContextProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        setSocket(io(import.meta.env.VITE_BACKEND_URL));
    }, []);

    return (
        <WebSocketContext.Provider value={{socket}}>
            {children}
        </WebSocketContext.Provider>
    )
}