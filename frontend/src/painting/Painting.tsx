import React, {useEffect, useState} from 'react'
import {Color, Coords} from "../types.ts";
import {canvasList} from "../canvas/canvas.list.ts";
import Canvas from "../canvas/Canvas.tsx";
import {colors, useCanvasColor} from "../canvas/canvas.color.context.provider.tsx";
import {PIXEL_OFFSET, PIXEL_SIZE} from "../canvas/canvas.helper.ts";

function Painting() {
    const [
        mousePosition,
        setMousePosition
    ] = useState<Coords>({x: window.innerWidth / 2, y: window.innerHeight / 2});

    const {color, setColor} = useCanvasColor();

    useEffect(function mouseMoveEventListener() {
        function handleMouseMove(e: MouseEvent) {
            setMousePosition({
                x: e.clientX,
                y: e.clientY ,
            });
        }

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleColorChange = (e: React.MouseEvent<HTMLDivElement>, color: Color) => {
        e.stopPropagation();

        setColor(color);
    }

    return (
        <div
            style={{
                padding: 10,
            }}
        >
            <p style={{fontSize: 30, textAlign: "center"}}>Painting</p>
            {Object.entries(canvasList).map(([key, {ratioX, ratioY}]) => (
                <div key={key}>
                    <Canvas ratioX={ratioX} ratioY={ratioY} id={key} isDisplay={false}/>
                </div>
            ))}
            <div
                id="palette"
                style={{
                    zIndex: 1,
                    paddingBottom: "40px",
                    width: "100%",
                    position: "fixed",
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    pointerEvents: "none",
                }}
            >
                {colors.map((colorFromArray) => (
                    <div
                        key={colorFromArray}
                        style={{
                            pointerEvents: "auto",
                            cursor: "pointer",
                            border: "3px solid lightgray",
                            backgroundColor: colorFromArray,
                            width: 30,
                            height: 30,
                            borderRadius: 25
                        }}
                        onClick={(e) => handleColorChange(e, colorFromArray)}
                    ></div>
                ))}
            </div>
            <div
                id="mouse-tracker"
                style={{
                    width: PIXEL_SIZE,
                    height: PIXEL_SIZE,
                    backgroundColor: color,
                    position: "fixed",
                    top: mousePosition.y + PIXEL_OFFSET,
                    left: mousePosition.x + PIXEL_OFFSET,
                    pointerEvents: "none",
                }}
            ></div>
        </div>
    )
}

export default Painting

