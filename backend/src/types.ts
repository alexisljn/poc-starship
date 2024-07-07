export type Cell = {
    x: number,
    y: number,
    color: string;
}

export type CellWithCanvasId = Cell & {
    canvasId: string
}