"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { CanvasEngineProvider, useCanvasEngineContext } from "@/features/canvas-editor/context/CanvasEngineContext";
import { CanvasSurface } from "@/features/canvas-editor/components/CanvasSurface";

const PublicCanvasLoader = ({ slug, onError }: { slug: string; onError: (msg: string) => void }) => {
    const { engine } = useCanvasEngineContext();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!engine || loaded) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await api.getPublicCanvas(slug);
                if (!cancelled && data.canvasJson) {
                    await engine.importJSON(data.canvasJson);
                    engine.setInteractive(false); // view-only: no selection, no dragging
                }
            } catch {
                if (!cancelled) onError("This canvas isn't available — the link may be invalid or no longer shared.");
            } finally {
                if (!cancelled) setLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [engine, loaded, slug, onError]);

    return null;
};

const PublicCanvasPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [error, setError] = useState<string | null>(null);

    return (
        <main className="flex h-screen w-full flex-col">
            <div className="border-b border-panel-border bg-white px-4 py-2">
                <p className="text-sm font-medium text-zinc-500">Drawspace — shared canvas (view only)</p>
            </div>
            {error ? (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-zinc-400">{error}</p>
                </div>
            ) : (
                <CanvasEngineProvider>
                    <PublicCanvasLoader slug={slug} onError={setError} />
                    <div className="flex-1">
                        <CanvasSurface />
                    </div>
                </CanvasEngineProvider>
            )}
        </main>
    );
};

export default PublicCanvasPage;