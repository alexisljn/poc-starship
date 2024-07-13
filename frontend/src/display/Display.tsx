import {useParams} from "react-router-dom";
import {canvasList} from "../canvas/canvas.list.ts";
import Canvas from "../canvas/Canvas.tsx";

export default function Display() {
    const {id} = useParams();

    if (!id || !Object.keys(canvasList).includes(id)) {
        return (
            <div>
                <p>This id match no canvas</p>
            </div>
        )
    }

    return (
        <div style={{overflow: "hidden"}}>
            <Canvas
                id={id}
                ratioX={canvasList[id].ratioX}
                ratioY={canvasList[id].ratioY}
                isDisplay={true}
            />
        </div>
    )
}