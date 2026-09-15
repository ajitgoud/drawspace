export type ShapeType = "rectangle" | "ellipse" | "triangle" | "text" | "line" | "arrow";
export type BrushType = "pencil" | "pen" | "marker" | "brush";

export interface ObjectAttributes {
    id: string;
    shapeType: string; // "rectangle" | "ellipse" | ... | "freehand" | "image"
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: string;
    angle?: number;
}

export interface CanvasEditingApi {
    resize(width: number, height: number): void;
    addShape(type: ShapeType, options?: Record<string, unknown>): string;
    addImageFromUrl(url: string, options?: Record<string, unknown>): Promise<string>;
    removeActiveObjects(): void;
    duplicateActiveObjects(): void;
    bringForward(): void;
    sendBackward(): void;
    deselectAll(): void;
    getActiveObjectId(): string | null;
    getActiveObjectIds(): string[];
    getObjectAttributes(id: string): ObjectAttributes | null;
    updateObjectAttributes(id: string, attrs: Partial<ObjectAttributes>): void;
    setInteractive(enabled: boolean): void;
}

export interface CanvasPersistenceApi {
    toJSON(): string;
    loadFromJSON(json: string): Promise<void>;
    exportPNG(): string;
    exportJPEG(): string;
    exportJSON(): string;
    importJSON(json: string): Promise<void>;
}

export type CanvasEngineEvent = "selection:changed" | "object:changed";

export interface CanvasEventApi {
    on(event: CanvasEngineEvent, handler: () => void): void;
    off(event: CanvasEngineEvent, handler: () => void): void;
}

export interface CanvasDrawingApi {
    setDrawingMode(enabled: boolean): void;
    setBrush(type: BrushType, options?: { color?: string; width?: number }): void;
}

export interface CanvasEngine
    extends CanvasEditingApi, CanvasPersistenceApi, CanvasEventApi, CanvasDrawingApi {
    initialize(
        canvasElement: HTMLCanvasElement,
        options?: { width: number; height: number; backgroundColor?: string }
    ): void;
    dispose(): void;
}