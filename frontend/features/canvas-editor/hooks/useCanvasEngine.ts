"use client";

import { useEffect, useRef, useState } from "react";
import { FabricCanvasEngine } from "../engine/FabricCanvasEngine";
import type { CanvasEngine } from "../engine/CanvasEngine";

interface UseCanvasEngineResult {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    engine: CanvasEngine | null;
    isSelected: boolean;
    selectedCount: number;
}

export function useCanvasEngine(options?: {
    width: number;
    height: number;
    backgroundColor?: string;
}): UseCanvasEngineResult {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [engine, setEngine] = useState<CanvasEngine | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const instance = new FabricCanvasEngine();
        instance.initialize(canvasRef.current, options);
        setEngine(instance);

        const handleSelectionChanged = () => setSelectedIds(instance.getActiveObjectIds());
        instance.on("selection:changed", handleSelectionChanged);

        return () => {
            instance.off("selection:changed", handleSelectionChanged);
            instance.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        canvasRef,
        engine,
        isSelected: selectedIds.length > 0,
        selectedCount: selectedIds.length,
    };
}