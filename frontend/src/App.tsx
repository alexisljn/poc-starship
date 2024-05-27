import React, { useCallback, useEffect, useMemo, useRef, useState} from 'react'
import './App.css'
import {io, Socket} from "socket.io-client";
import {Color, Coords, PaintCoords} from "./types.ts";

const PIXEL_SIZE = 15;

const PIXEL_OFFSET = 5;

function App() {
    const [
        windowDimensions,
        setWindowDimensions
    ] = useState<{width: number, height: number}>({width: 0, height: 0});

    const [
        mousePosition,
        setMousePosition
    ] = useState<Coords>({x: window.innerWidth / 2, y: window.innerHeight / 2});

    const [
        socket,
        setSocket
    ] = useState<Socket | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const ctx = useMemo(() => {
        if (!canvasRef.current) {
            return null;
        }

        return canvasRef.current.getContext('2d');
    }, [canvasRef.current]);

    const colors: Color[] = useMemo(() => {
        return ['black', 'gray', 'white', 'red', 'orange', 'gold', 'green', 'aqua', 'blue', 'purple'];
    }, []);

    const [color, setColor] = useState<Color>(colors[Math.floor(Math.random() * colors.length)]);

    // Event Listeners
    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        function handleMouseMove(e: MouseEvent) {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);

            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Socket Initialisation
    useEffect(() => {
        setSocket(io(import.meta.env.VITE_BACKEND_URL));
    }, []);

    useEffect(() => {
        if (!socket || !ctx) {
            return;
        }

        socket.on("init", (paintsCoords: PaintCoords[]) => {
            if (paintsCoords.length === 0) {
                return;
            }

            paintsCoords.forEach((paintCoords) => {
                ctx.fillStyle = paintCoords.color;

                ctx.fillRect(paintCoords.x - PIXEL_OFFSET, paintCoords.y - PIXEL_OFFSET, PIXEL_SIZE, PIXEL_SIZE);
            });
        });

        socket.on("update", (paintCoords: PaintCoords) => {
            ctx.fillStyle = paintCoords.color;

            ctx.fillRect(paintCoords.x - PIXEL_OFFSET, paintCoords.y - PIXEL_OFFSET, PIXEL_SIZE, PIXEL_SIZE);
        })
    }, [socket, ctx]);

    // Canvas Initialization
    useEffect(() => {
        if (!canvasRef.current || !ctx) {
            return;
        }

        ctx.fillStyle = 'white';

        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [windowDimensions, canvasRef.current, ctx]);


    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ctx) {
            return;
        }

        ctx.fillStyle = color;

        ctx.fillRect(e.clientX - PIXEL_OFFSET, e.clientY - PIXEL_OFFSET, PIXEL_SIZE, PIXEL_SIZE);

        if (!socket) {
            alert("No socket");

            return;
        }

        socket.emit("paint", {
            x: e.clientX,
            y: e.clientY,
            color,
        });

    }, [ctx, color, socket]);

    return (
        <div
            style={{
                backgroundColor: "gray",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                width: "100vw",
                height: "100vh",
            }}
            onClick={handleClick}
        >
            <canvas
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0
                }}
                ref={canvasRef}
                width={windowDimensions.width}
                height={windowDimensions.height}
            ></canvas>
            <div
                id="palette"
                style={{
                    zIndex: 1,
                    display: "flex",
                    gap: "10px",
                    paddingBottom: "40px"
                }}
            >
                {colors.map((color) => (
                    <div
                        key={color}
                        style={{
                            cursor: "pointer",
                            border: "3px solid lightgray",
                            backgroundColor: color,
                            width: 30,
                            height: 30,
                            borderRadius: 25
                        }}
                        onClick={() => setColor(color)}
                    ></div>
                ))}
            </div>
            <div
                id="mouse-tracker"
                style={{
                    width: PIXEL_SIZE,
                    height: PIXEL_SIZE,
                    backgroundColor: color,
                    position: "absolute",
                    top: mousePosition.y - PIXEL_OFFSET,
                    left: mousePosition.x - PIXEL_OFFSET,
                }}
            ></div>
        </div>
    )
}

export default App
