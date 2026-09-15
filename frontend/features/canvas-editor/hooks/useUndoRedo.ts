"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasEngine } from "../engine/CanvasEngine";

interface UseUndoRedoResult {
    canUndo: boolean;
    canRedo: boolean;
    undo: () => Promise<void>;
    redo: () => Promise<void>;
}

export function useUndoRedo(engine: CanvasEngine | null): UseUndoRedoResult {
    const currentSnapshot = useRef<string | null>(null);
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);
    const isApplyingHistory = useRef(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    useEffect(() => {
        if (!engine) return;

        currentSnapshot.current = engine.toJSON();

        const handleChange = () => {
            if (isApplyingHistory.current) return;
            const newSnapshot = engine.toJSON();
            if (currentSnapshot.current !== null) {
                undoStack.current.push(currentSnapshot.current);
                redoStack.current = [];
                setCanUndo(true);
                setCanRedo(false);
            }
            currentSnapshot.current = newSnapshot;
        };

        engine.on("object:changed", handleChange);
        return () => engine.off("object:changed", handleChange);
    }, [engine]);

    const undo = useCallback(async () => {
        if (!engine || undoStack.current.length === 0 || currentSnapshot.current === null) return;
        const previous = undoStack.current.pop()!;
        redoStack.current.push(currentSnapshot.current);
        isApplyingHistory.current = true;
        await engine.loadFromJSON(previous);
        isApplyingHistory.current = false;
        currentSnapshot.current = previous;
        setCanUndo(undoStack.current.length > 0);
        setCanRedo(true);
    }, [engine]);

    const redo = useCallback(async () => {
        if (!engine || redoStack.current.length === 0 || currentSnapshot.current === null) return;
        const next = redoStack.current.pop()!;
        undoStack.current.push(currentSnapshot.current);
        isApplyingHistory.current = true;
        await engine.loadFromJSON(next);
        isApplyingHistory.current = false;
        currentSnapshot.current = next;
        setCanRedo(redoStack.current.length > 0);
        setCanUndo(true);
    }, [engine]);

    return { canUndo, canRedo, undo, redo };
}