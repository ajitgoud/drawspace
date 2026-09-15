"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useCanvasEngine } from "../hooks/useCanvasEngine";
import { useUndoRedo } from "../hooks/useUndoRedo";
import type { CanvasEngine, BrushType } from "../engine/CanvasEngine";
import { CANVAS_OPTIONS } from "../engine/canvasConfig";


interface CanvasEngineContextValue {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    engine: CanvasEngine | null;
    isSelected: boolean;
    selectedCount: number;
    canUndo: boolean;
    canRedo: boolean;
    undo: () => Promise<void>;
    redo: () => Promise<void>;
    activeDrawTool: BrushType | null;
    selectDrawTool: (type: BrushType) => void;
    exitDrawMode: () => void;
}

const CanvasEngineContext = createContext<CanvasEngineContextValue | null>(null);

export function CanvasEngineProvider({ children }: { children: ReactNode }) {
    const engineState = useCanvasEngine({ width: 1100, height: 700, backgroundColor: "#ffffff" });
    const undoRedoState = useUndoRedo(engineState.engine);
    const [activeDrawTool, setActiveDrawTool] = useState<BrushType | null>(null);
    const { canvasRef, engine, isSelected, selectedCount } = useCanvasEngine(CANVAS_OPTIONS);

    const selectDrawTool = useCallback(
        (type: BrushType) => {
            engineState.engine?.setBrush(type);
            engineState.engine?.setDrawingMode(true);
            setActiveDrawTool(type);
        },
        [engineState.engine]
    );

    const exitDrawMode = useCallback(() => {
        engineState.engine?.setDrawingMode(false);
        setActiveDrawTool(null);
    }, [engineState.engine]);

    return (
        <CanvasEngineContext.Provider
            value={{ ...engineState, ...undoRedoState, activeDrawTool, selectDrawTool, exitDrawMode }}
        >
            {children}
        </CanvasEngineContext.Provider>
    );
}

export function useCanvasEngineContext(): CanvasEngineContextValue {
    const ctx = useContext(CanvasEngineContext);
    if (!ctx) throw new Error("useCanvasEngineContext must be used within a CanvasEngineProvider");
    return ctx;
}