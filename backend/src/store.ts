import {Cell, CellWithCanvasId} from "./types";

let store: Record<string, Cell[]> = {};

export function getStore() {
    return store;
}

export function addToStore(cellData: CellWithCanvasId) {
    const {x, y, color, canvasId} = cellData;

    if (store[canvasId] === undefined) {
        store[canvasId] = [];
    }

    store[canvasId].push({
        x,
        y,
        color
    });
}

export function clearStore(canvasId: string) {
    delete store[canvasId];
}