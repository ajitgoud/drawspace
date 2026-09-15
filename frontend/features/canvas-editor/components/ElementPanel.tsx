"use client";

import { Type, Minus, ArrowRight, Triangle, Square, Circle } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { IconButton } from "@/shared/ui/IconButton";
import type { ShapeType } from "../engine/CanvasEngine";

const SHAPE_BUTTONS: { type: ShapeType; label: string; icon: typeof Square }[] = [
    { type: "text", label: "Text", icon: Type },
    { type: "line", label: "Line", icon: Minus },
    { type: "arrow", label: "Arrow", icon: ArrowRight },
    { type: "triangle", label: "Triangle", icon: Triangle },
    { type: "rectangle", label: "Rectangle", icon: Square },
    { type: "ellipse", label: "Ellipse", icon: Circle },
];

export function ElementPanel() {
    const { engine, exitDrawMode } = useCanvasEngineContext();
    return (
        <div className="flex flex-col gap-1 p-2">
            {SHAPE_BUTTONS.map(({ type, label, icon }) => (
                <IconButton
                    key={type}
                    icon={icon}
                    label={label}
                    onClick={() => {
                        exitDrawMode();
                        engine?.addShape(type);
                    }}
                />
            ))}
        </div>
    );
}