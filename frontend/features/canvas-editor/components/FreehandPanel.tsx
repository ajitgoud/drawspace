"use client";

import { MousePointer2, Pencil, PenLine, Highlighter, Paintbrush } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { IconButton } from "@/shared/ui/IconButton";
import type { BrushType } from "../engine/CanvasEngine";

const BRUSH_BUTTONS: { type: BrushType; label: string; icon: typeof Pencil }[] = [
    { type: "pencil", label: "Pencil", icon: Pencil },
    { type: "pen", label: "Pen", icon: PenLine },
    { type: "marker", label: "Marker", icon: Highlighter },
    { type: "brush", label: "Brush", icon: Paintbrush },
];

export function FreehandPanel() {
    const { activeDrawTool, selectDrawTool, exitDrawMode } = useCanvasEngineContext();

    return (
        <div className="flex flex-col gap-1 rounded-2xl border border-panel-border bg-panel p-2 shadow-sm">
            <IconButton icon={MousePointer2} label="Select" active={activeDrawTool === null} onClick={exitDrawMode} />
            <div className="my-1 h-px bg-panel-border" />
            {BRUSH_BUTTONS.map(({ type, label, icon }) => (
                <IconButton
                    key={type}
                    icon={icon}
                    label={label}
                    active={activeDrawTool === type}
                    onClick={() => selectDrawTool(type)}
                />
            ))}
        </div>
    );
}