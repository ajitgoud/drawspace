"use client";
import { useEffect, useState, useCallback } from "react";
import type { CanvasEngine, ObjectAttributes } from "../engine/CanvasEngine";

export function useSelectedAttributes(engine: CanvasEngine | null) {
    const [attributes, setAttributes] = useState<ObjectAttributes | null>(null);

    const refresh = useCallback(() => {
        if (!engine) {
            setAttributes(null);
            return;
        }
        const ids = engine.getActiveObjectIds();
        if (ids.length !== 1) {
            // Panel only edits single-object selections — multi-select attribute
            // editing is a real feature but not one we need for v1.
            setAttributes(null);
            return;
        }
        setAttributes(engine.getObjectAttributes(ids[0]));
    }, [engine]);

    useEffect(() => {
        if (!engine) return;
        refresh();
        engine.on("selection:changed", refresh);
        engine.on("object:changed", refresh);
        return () => {
            engine.off("selection:changed", refresh);
            engine.off("object:changed", refresh);
        };
    }, [engine, refresh]);

    const update = useCallback(
        (patch: Partial<ObjectAttributes>) => {
            if (!engine || !attributes) return;
            engine.updateObjectAttributes(attributes.id, patch);
        },
        [engine, attributes]
    );

    return { attributes, update };
}