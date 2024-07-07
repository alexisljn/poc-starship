import {createContext, ReactNode, useContext, useState} from "react";
import {Color} from "../types.ts";

export const colors: Color[] =  ['black', 'gray', 'white', 'red', 'orange', 'gold', 'green', 'aqua', 'blue', 'purple'];

type CanvasColorContextType = {
    color: Color,
    setColor: (color: Color) => void
}

const CanvasColorContext = createContext<CanvasColorContextType>({color: "black", setColor: () => {}});

export const useCanvasColor = () => {
    return useContext(CanvasColorContext);
}

type CanvasColorContextProviderProps = {
    children: ReactNode
}

export default function CanvasColorContextProvider({children}: CanvasColorContextProviderProps) {
    const [
        color,
        setColor
    ] = useState<Color>(colors[Math.floor(Math.random() * colors.length)]);

    return (
        <CanvasColorContext.Provider value={{color, setColor}}>
            {children}
        </CanvasColorContext.Provider>
    )
}