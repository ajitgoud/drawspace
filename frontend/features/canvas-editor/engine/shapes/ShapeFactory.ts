import { Rect, Ellipse, Triangle, IText, Line, Group, type FabricObject } from "fabric";
import type { ShapeType } from "../CanvasEngine";

type ShapeCreator = (options?: Record<string, unknown>) => FabricObject;

const registry = new Map<ShapeType, ShapeCreator>();

export function registerShape(type: ShapeType, creator: ShapeCreator) {
    registry.set(type, creator);
}

export function createShape(type: ShapeType, options?: Record<string, unknown>): FabricObject {
    const creator = registry.get(type);
    if (!creator) {
        throw new Error(`No shape creator registered for type: ${type}`);
    }
    return creator(options);
}

registerShape("rectangle", (options) =>
    new Rect({ width: 100, height: 80, fill: "#3b82f6", left: 100, top: 100, ...options })
);

registerShape("ellipse", (options) =>
    new Ellipse({ rx: 60, ry: 40, fill: "#22c55e", left: 100, top: 100, ...options })
);

registerShape("triangle", (options) =>
    new Triangle({ width: 100, height: 100, fill: "#f97316", left: 100, top: 100, ...options })
);

registerShape("text", (options) =>
    new IText("Double click to edit", { fontSize: 24, fill: "#111827", left: 100, top: 100, ...options })
);

registerShape("line", (options) =>
    new Line([50, 50, 200, 50], { stroke: "#111827", strokeWidth: 3, ...options })
);

registerShape("arrow", (options) => {
    const shaft = new Line([0, 0, 150, 0], { stroke: "#111827", strokeWidth: 3 });
    const head = new Triangle({
        width: 16,
        height: 20,
        fill: "#111827",
        left: 150,
        top: 0,
        angle: 90,
        originX: "center",
        originY: "center",
    });
    return new Group([shaft, head], { left: 100, top: 100, ...options });
});