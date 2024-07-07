export type Color = 'black' | 'gray' | 'white' | 'red' | 'orange' | 'gold' | 'green' | 'aqua' | 'blue' | 'purple';

export type Coords = {
    x: number,
    y: number
}

export type PaintCellCoords = Coords & {
    color: Color;
}

export type PaintCellCoordsWithCanvasId = PaintCellCoords & {
    canvasId: string
}