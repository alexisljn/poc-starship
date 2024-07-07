import {Color} from "../types.ts";

export const PIXEL_SIZE = 15;

export const PIXEL_OFFSET = 5;

export const DEFAULT_CANVAS_SIZE = 400;

export const DEFAULT_CANVAS_COLOR: Color = "white";

function getCanvasHeight(ratioY: number) {
    let tmpHeight = Math.floor(DEFAULT_CANVAS_SIZE * ratioY);

    if ((tmpHeight / PIXEL_SIZE) % 2 !== 0) {
        while((tmpHeight / PIXEL_SIZE) % 2 !== 0) {
            tmpHeight -= 1;
        }
    }

    return tmpHeight;
}

function getCanvasWidth(ratioX: number) {
    let tmpWidth = Math.floor(DEFAULT_CANVAS_SIZE * ratioX);

    if ((tmpWidth / PIXEL_SIZE) % 2 !== 0) {
        while((tmpWidth / PIXEL_SIZE) % 2 !== 0) {
            tmpWidth -= 1
        }
    }

    return tmpWidth;
}

export {
    getCanvasHeight,
    getCanvasWidth,
}