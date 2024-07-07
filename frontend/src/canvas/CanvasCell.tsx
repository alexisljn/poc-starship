import React from "react";
import {Color} from "../types.ts";
import {PIXEL_SIZE} from "./canvas.helper.ts";

type CanvasCellProps = {
    lineIndex: number,
    colIndex: number,
    color: Color,
    onPixelEnter: (lineIndex: number, colIndex: number) => void,
    isDisplay: boolean,
}

const CanvasCell = React.memo(function CanvasCell({lineIndex, colIndex, color, onPixelEnter, isDisplay}: CanvasCellProps) {
    return (
        <div
            key={colIndex}
            className={isDisplay ? "" : "canvas-cell"}
            style={{
                width: PIXEL_SIZE,
                height: PIXEL_SIZE,
                backgroundColor: color,
            }}
            onMouseEnter={isDisplay ? undefined : () => onPixelEnter(lineIndex, colIndex)}
        ></div>
    )

})

export default CanvasCell;