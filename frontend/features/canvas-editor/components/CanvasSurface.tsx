"use client";

import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { CANVAS_OPTIONS } from "../engine/canvasConfig";

export function CanvasSurface() {
    const { canvasRef } = useCanvasEngineContext();
    const { width, height } = CANVAS_OPTIONS;
    return (
        <div className="flex h-full w-full items-center justify-center bg-canvas-bg">
            <div className="rounded-lg border border-panel-border bg-panel p-1 shadow-xl">
                <div style={{ width: width + 8, height: height + 8 }} >
                    <canvas ref={canvasRef} width={width} height={height} className="rounded-md"/>
                </div>
            </div>
        </div>
    );
}