import {PaintCoords} from "./types";

let store: PaintCoords[] = [];

export function getStore() {
    return store;
}

export function addToStore(coords: PaintCoords) {
    store.push(coords);
}

export function clearStore() {
    store = [];
}