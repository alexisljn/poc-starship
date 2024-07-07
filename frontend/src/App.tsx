import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Painting from "./painting/Painting.tsx";
import Display from "./display/Display.tsx";
import WebSocketContextProvider from "./websocket/websocket.context.provider.tsx";
import CanvasColorContextProvider from "./canvas/canvas.color.context.provider.tsx";
import Editor from "./editor/Editor.tsx";

function App() {
    return (
        <WebSocketContextProvider>
            <CanvasColorContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Painting/>}/>
                        <Route path="/view/:id" element={<Display/>}/>
                        <Route path="/editor" element={<Editor/>}/>
                    </Routes>
                </BrowserRouter>
            </CanvasColorContextProvider>
        </WebSocketContextProvider>
    )
}

export default App
