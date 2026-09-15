"use client";

import { Undo2, Redo2, Trash2, Copy, ArrowUp, ArrowDown } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { IconButton } from "@/shared/ui/IconButton";

export function Toolbar() {
    const { engine, isSelected, canUndo, canRedo, undo, redo } = useCanvasEngineContext();
    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-panel-border bg-panel p-2 shadow-sm">
            <IconButton icon={Undo2} label="Undo" disabled={!canUndo} onClick={undo} />
            <IconButton icon={Redo2} label="Redo" disabled={!canRedo} onClick={redo} />
            <div className="my-1 h-px bg-panel-border" />
            <IconButton icon={Trash2} label="Delete" disabled={!isSelected} onClick={() => engine?.removeActiveObjects()} />
            <IconButton icon={Copy} label="Duplicate" disabled={!isSelected} onClick={() => engine?.duplicateActiveObjects()} />
            <IconButton icon={ArrowUp} label="Bring forward" disabled={!isSelected} onClick={() => engine?.bringForward()} />
            <IconButton icon={ArrowDown} label="Send backward" disabled={!isSelected} onClick={() => engine?.sendBackward()} />
        </div>
    );
}