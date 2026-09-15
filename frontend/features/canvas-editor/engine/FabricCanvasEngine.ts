import { Canvas, FabricImage, PencilBrush, Shadow, type FabricObject } from "fabric";
import type {CanvasEngine, CanvasEngineEvent, ShapeType, BrushType, ObjectAttributes} from "./CanvasEngine";
import { createShape } from "./shapes/ShapeFactory";

type EventHandler = () => void;

const BRUSH_PRESETS: Record<BrushType, { color: string; width: number; soft?: boolean }> = {
    pencil: { color: "#374151", width: 2 },
    pen: { color: "#111827", width: 3 },
    marker: { color: "rgba(99, 102, 241, 0.5)", width: 14 },
    brush: { color: "rgba(17, 24, 39, 0.85)", width: 22, soft: true },
};

export class FabricCanvasEngine implements CanvasEngine {
    private canvas: Canvas | null = null;
    private listeners: Record<CanvasEngineEvent, Set<EventHandler>> = {
        "selection:changed": new Set(),
        "object:changed": new Set(),
    };

    initialize(
        canvasElement: HTMLCanvasElement,
        options?: { width: number; height: number; backgroundColor?: string }
    ): void {
        this.canvas = new Canvas(canvasElement, {
            width: options?.width ?? 800,
            height: options?.height ?? 500,
            backgroundColor: options?.backgroundColor ?? "#ffffff",
            enableRetinaScaling: true,
        });

        this.canvas.on("selection:created", () => this.emit("selection:changed"));
        this.canvas.on("selection:updated", () => this.emit("selection:changed"));
        this.canvas.on("selection:cleared", () => this.emit("selection:changed"));
        this.canvas.on("object:modified", () => this.emit("object:changed"));
        this.canvas.on("object:added", () => this.emit("object:changed"));
        this.canvas.on("object:removed", () => this.emit("object:changed"));

        this.canvas.on("path:created", (e: any) => {
            const path = e.path as FabricObject | undefined;
            if (path) {
                path.set("id", `freehand_${crypto.randomUUID()}`);
                path.set("shapeType", "freehand");
            }
        });
    }

    resize(width: number, height: number): void {
        this.requireCanvas().setDimensions({ width, height });
        this.requireCanvas().requestRenderAll();
    }

    dispose(): void {
        this.canvas?.dispose();
        this.canvas = null;
    }

    private requireCanvas(): Canvas {
        if (!this.canvas) {
            throw new Error("CanvasEngine used before initialize() was called");
        }
        return this.canvas;
    }

    private emit(event: CanvasEngineEvent) {
        this.listeners[event].forEach((handler) => handler());
    }

    on(event: CanvasEngineEvent, handler: EventHandler): void {
        this.listeners[event].add(handler);
    }

    off(event: CanvasEngineEvent, handler: EventHandler): void {
        this.listeners[event].delete(handler);
    }

    setDrawingMode(enabled: boolean): void {
        this.requireCanvas().isDrawingMode = enabled;
    }

    setBrush(type: BrushType, options?: { color?: string; width?: number }): void {
        const canvas = this.requireCanvas();
        const preset = BRUSH_PRESETS[type];
        const brush = new PencilBrush(canvas);
        brush.color = options?.color ?? preset.color;
        brush.width = options?.width ?? preset.width;
        if (preset.soft) {
            brush.shadow = new Shadow({ color: brush.color, blur: 8, offsetX: 0, offsetY: 0 });
        }
        canvas.freeDrawingBrush = brush;
    }

    addShape(type: ShapeType, options?: Record<string, unknown>): string {
        const canvas = this.requireCanvas();
        const id = `${type}_${crypto.randomUUID()}`;
        const shape = createShape(type, options);
        shape.set("id", id);
        shape.set("shapeType", type);
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.requestRenderAll();
        return id;
    }

    async addImageFromUrl(url: string, options?: Record<string, unknown>): Promise<string> {
        const canvas = this.requireCanvas();
        const image = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
        const id = `image_${crypto.randomUUID()}`;
        image.set("id", id);
        image.set("shapeType", "image");
        if (options) image.set(options);
        canvas.add(image);
        canvas.setActiveObject(image);
        canvas.requestRenderAll();
        return id;
    }

    removeActiveObjects(): void {
        const canvas = this.requireCanvas();
        const active = canvas.getActiveObjects();
        canvas.remove(...active);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }

    duplicateActiveObjects(): void {
        const canvas = this.requireCanvas();
        canvas.getActiveObjects().forEach(async (obj) => {
            const clone = await obj.clone();
            clone.set({
                left: (obj.left ?? 0) + 20,
                top: (obj.top ?? 0) + 20,
                id: `${obj.get("shapeType") ?? "object"}_${crypto.randomUUID()}`,
            });
            canvas.add(clone);
            canvas.requestRenderAll();
        });
    }

    bringForward(): void {
        const canvas = this.requireCanvas();
        const obj = canvas.getActiveObject();
        if (obj) canvas.bringObjectForward(obj);
        canvas.requestRenderAll();
    }

    sendBackward(): void {
        const canvas = this.requireCanvas();
        const obj = canvas.getActiveObject();
        if (obj) canvas.sendObjectBackwards(obj);
        canvas.requestRenderAll();
    }

    deselectAll(): void {
        const canvas = this.requireCanvas();
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }

    getActiveObjectId(): string | null {
        const obj = this.requireCanvas().getActiveObject();
        return obj ? (obj.get("id") as string) : null;
    }

    getActiveObjectIds(): string[] {
        return this.requireCanvas()
            .getActiveObjects()
            .map((obj) => obj.get("id") as string);
    }

    getObjectAttributes(id: string): ObjectAttributes | null {
        const obj = this.requireCanvas()
            .getObjects()
            .find((o: any) => o.id === id) as any;
        if (!obj) return null;

        return {
            id: obj.id,
            shapeType: obj.shapeType ?? obj.type,
            fill: typeof obj.fill === "string" ? obj.fill : undefined,
            stroke: obj.stroke ?? undefined,
            strokeWidth: obj.strokeWidth,
            opacity: obj.opacity,
            fontSize: obj.fontSize,
            fontFamily: obj.fontFamily,
            textAlign: obj.textAlign,
            angle: obj.angle,
        };
    }

    updateObjectAttributes(id: string, attrs: Partial<ObjectAttributes>): void {
        const obj = this.requireCanvas().getObjects().find((o: any) => o.id === id);
        if (!obj) return;

        // set() accepts a partial object directly; Fabric ignores unknown keys
        // per object type (e.g. fontSize on a rectangle is a harmless no-op).
        obj.set(attrs as any);
        this.requireCanvas().requestRenderAll();
        this.requireCanvas().fire("object:modified", { target: obj });
    }

    exportJSON(): string {
        return JSON.stringify(this.toJSON());
    }

    async importJSON(json: string): Promise<void> {
        const data = JSON.parse(json);
        await this.loadFromJSON(data);
        this.requireCanvas().requestRenderAll();
    }

    toJSON(): string {
        return JSON.stringify(this.requireCanvas().toObject(["id", "shapeType"]));
    }

    async loadFromJSON(json: string): Promise<void> {
        const canvas = this.requireCanvas();
        await canvas.loadFromJSON(JSON.parse(json));
        canvas.requestRenderAll();
    }

    exportPNG(): string {
        return this.requireCanvas().toDataURL({ format: "png", quality: 1, multiplier: 1 });
    }

    exportJPEG(): string {
        return this.requireCanvas().toDataURL({ format: "jpeg", quality: 1, multiplier: 1 });
    }
}