"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { TooltipProvider } from "@/shared/ui/Tooltip";
import { CanvasEngineProvider, useCanvasEngineContext } from "@/features/canvas-editor/context/CanvasEngineContext";
import { ElementPanel } from "@/features/canvas-editor/components/ElementPanel";
import { FreehandPanel } from "@/features/canvas-editor/components/FreehandPanel";
import { Toolbar } from "@/features/canvas-editor/components/Toolbar";
import { CanvasSurface } from "@/features/canvas-editor/components/CanvasSurface";
import AttributesPanel from "@/features/canvas-editor/components/AttributesPanel";
import ExportControls from "@/features/canvas-editor/components/ExportControls";
import SaveButton from "@/features/canvas-editor/components/SaveButton";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import ShareButton from "@/features/canvas-editor/components/ShareButton";

const CanvasLoader = ({
                          canvasId,
                          onLoaded,
                      }: {
    canvasId: string;
    onLoaded: (title: string) => void;
}) => {
    const { engine } = useCanvasEngineContext();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!engine || loaded) return;
        let cancelled = false;
        (async () => {
            const data = await api.getCanvas(canvasId);
            if (cancelled) return;
            if (data.canvasJson) await engine.importJSON(data.canvasJson);
            onLoaded(data.title ?? "Untitled canvas");
            setLoaded(true);
        })();
        return () => {
            cancelled = true;
        };
    }, [engine, loaded, canvasId, onLoaded]);

    return null;
};

const EditorPage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [title, setTitle] = useState("Untitled canvas");
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (!getToken()) {
            router.replace("/login");
            return;
        }
        setAuthChecked(true);
    }, [router]);

    if (!authChecked) return null;

    return (
        <TooltipProvider>
            <CanvasEngineProvider>
                <CanvasLoader canvasId={id} onLoaded={setTitle} />
                <div className="flex h-screen w-full flex-col">
                    <div className="flex items-center justify-between border-b border-panel-border bg-white px-4 py-2">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-md px-2 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none"
                        />
                        <ShareButton canvasId={id} />
                        <SaveButton canvasId={id} title={title} />
                    </div>
                    <div className="flex flex-1 min-h-0">
                        <div className="flex h-full flex-col items-stretch gap-3  border-panel-border bg-canvas-bg p-3">
                            <div className="flex flex-col divide-y divide-panel-border overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-sm">
                                <ElementPanel />
                                <FreehandPanel />
                                <Toolbar />
                            </div>
                        </div>
                        <CanvasSurface />
                        <div className="flex w-64 flex-col border-l border-panel-border bg-panel">
                            <AttributesPanel />
                            <ExportControls />
                        </div>
                    </div>
                </div>
            </CanvasEngineProvider>
        </TooltipProvider>
    );
};

export default EditorPage;