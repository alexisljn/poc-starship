import React, {useCallback, useMemo, useState} from "react";
import {getCanvasHeight, getCanvasWidth} from "../canvas/canvas.helper.ts";

export default function Editor() {
    const [formValues, setFormValues] = useState<{height: string, width: string}>({
        height: "",
        width: "",
    });

    const resolution = useMemo(() => {
        const {height, width} = formValues;

        if ((isNaN(Number(height)) || isNaN(Number(width))
            || (Number(height) <= 0 || Number(width) <= 0))) {
            return "";
        }

        return `${getCanvasWidth(Number(width))}x${getCanvasHeight(Number(height))}`;
    }, [formValues]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, field: "height" | "width") => {
        let value = e.target.value;

        if (value.charCodeAt(value.length - 1) === 44) {
            value = value.slice(0, -1);

            value += ".";
        }

        setFormValues({
            ...formValues,
            [field]: value
        })

    }, [formValues])

    return (
        <div
            style={{
                padding: 10,
            }}
        >
            <p style={{fontSize: 30, textAlign: "center"}}>Editor</p>
            <p>Enter your webview scales on axis x and y to get the resolution</p>
            <div style={{display: "flex", gap: 20, marginTop: 20}}>
                <div style={{display: "flex", gap: 8}}>
                    <label htmlFor="width">width</label>
                    <input
                        type="text"
                        name="width"
                        id="width"
                        onChange={e => onChange(e, "width")}
                        value={formValues.width}
                    />
                </div>
                <div style={{display: "flex", gap: 8}}>
                    <label htmlFor="height">height</label>
                    <input
                        type="text"
                        name="height"
                        id="height"
                        onChange={e => onChange(e, "height")}
                        value={formValues.height}
                    />
                </div>
            </div>
            <p>Resolution : {resolution}</p>
        </div>
    )
}