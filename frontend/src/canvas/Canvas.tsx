import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useWebSocket} from "../websocket/websocket.context.provider.tsx";
import {useCanvasColor} from "./canvas.color.context.provider.tsx";
import {Color, PaintCellCoords, PaintCellCoordsWithCanvasId} from "../types.ts";
import CanvasCell from "./CanvasCell.tsx";
import cloneDeep from "lodash.clonedeep";
import {
    DEFAULT_CANVAS_COLOR,
    getCanvasHeight,
    getCanvasWidth,
    PIXEL_SIZE
} from "./canvas.helper.ts";

type CanvasProps = {
    ratioX: number;
    ratioY: number;
    id: string;
    isDisplay: boolean;
}

const Canvas = React.memo(function Canvas({ratioX, ratioY, id, isDisplay}: CanvasProps) {
    const [gridPosition, setGridPosition] = useState<{x: number, y: number} | null>(null);

    const [cellColors, setCellColors] = useState<Array<Array<Color>>>([]);

    const socket = useWebSocket();

    const {color} = useCanvasColor();

    const width = useMemo(() => {
        return getCanvasWidth(ratioX);
    }, [ratioX]);

    const height = useMemo(() => {
        return getCanvasHeight(ratioY);
    }, [ratioY]);

    console.log("size", id, width, height);

    const grid: Array<Array<number>> = useMemo(() => {
        const lines = Math.floor(height / PIXEL_SIZE);

        const cols = Math.floor(width / PIXEL_SIZE);

        const arr: Array<Array<number>> = [];

        for (let i = 0; i < lines; i++) {
            arr[i] = [];
            for (let j = 0; j < cols; j++) {
                arr[i].push(j)
            }
        }

        return arr;
    }, [width, height])

    useEffect(function canvasInitialization() {
        console.log('grid canvas init');

        const cellColors = grid.map(line => {
            return line.map(_col => {
                return DEFAULT_CANVAS_COLOR;
            })
        })

        setCellColors(cellColors);
    }, [grid]);

    useEffect(function socketEventListeners() {
        if (!socket) {
            return;
        }

        socket.on("init", (paintCellsCoords: Record<string, PaintCellCoords[]>) => {
            if (!paintCellsCoords[id] || paintCellsCoords[id].length === 0) {
                return;
            }

            const cellColorsClone = cloneDeep(cellColors);

            paintCellsCoords[id].forEach((paintCellCoords) => {
                const {color, x, y} = paintCellCoords;

                cellColorsClone[y][x] = color;
            });

            setCellColors(cellColorsClone);
        });

        socket.on("update", (paintCoords: PaintCellCoordsWithCanvasId) => {
            const {color, x, y, canvasId} = paintCoords;

            if (canvasId !== id) {
                return;
            }

            const cellColorsClone = cloneDeep(cellColors);

            cellColorsClone[y][x] = color;

            setCellColors(cellColorsClone);
        })

        socket.on("reset", (canvasId) => {
            if (canvasId !== id) {
                return;
            }

            const cellColorsClone = cloneDeep(cellColors);

            setCellColors(cellColorsClone.map(line => {
                return line.map(_col => {
                    return DEFAULT_CANVAS_COLOR;
                })
            }));
        })
    }, [socket, cellColors, id]);

    const handleClick = useCallback(() => {
        if (!gridPosition) {
            return;
        }

        const cellColorsClone = cloneDeep(cellColors);

        cellColorsClone[gridPosition.y][gridPosition.x] = color;

        setCellColors(cellColorsClone);

        if (!socket) {
            alert("No socket connected");

            return;
        }

        socket.emit("paint", {color, x: gridPosition.x, y: gridPosition.y, canvasId: id})
    }, [color, gridPosition, socket, cellColors, id]);

    const handleCanvasReset = useCallback(() => {
        if (!socket) {
            alert("No socket");

            return;
        }

        socket.emit("clear", id);
    }, [socket, id]);

    const onGridLeave = useCallback(() => {
        setGridPosition(null);
    }, []);

    const onPixelEnter = useCallback((lineIndex: number, colIndex: number) => {
        setGridPosition({x: colIndex, y: lineIndex});
    }, []);

    return (
        <>
            {!isDisplay &&
                <div style={{display: "flex", gap: 15}}>
                    <p><strong>Canvas</strong> : {id}</p>
                    {gridPosition && <p>Position : {gridPosition.y}, {gridPosition.x}</p>}
                </div>
            }
            <div
                id="grid"
                onMouseLeave={isDisplay ? undefined : onGridLeave}
                onClick={isDisplay ? undefined : handleClick}
            >
                {grid.map((line, lineIndex) => (
                    <div key={lineIndex} style={{width, height: PIXEL_SIZE, display: "flex"}}>
                        {line.map((_col, colIndex) => (
                            <CanvasCell
                                key={colIndex}
                                lineIndex={lineIndex}
                                colIndex={colIndex}
                                color={cellColors[lineIndex]
                                    ? cellColors[lineIndex][colIndex]
                                    : DEFAULT_CANVAS_COLOR}
                                onPixelEnter={onPixelEnter}
                                isDisplay={isDisplay}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {!isDisplay &&
                <p
                    style={{
                        fontSize: 20,
                        cursor: "pointer",
                    }}
                    onClick={handleCanvasReset}
                >🗑️</p>
            }
        </>
    )
});

export default Canvas;