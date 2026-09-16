"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getToken, clearToken } from "@/lib/api";
import { LogOut } from "lucide-react";
import { TooltipProvider } from "@/shared/ui/Tooltip";
import { CanvasEngineProvider, useCanvasEngineContext } from "@/features/canvas-editor/context/CanvasEngineContext";
import { ElementPanel } from "@/features/canvas-editor/components/ElementPanel";
import { FreehandPanel } from "@/features/canvas-editor/components/FreehandPanel";
import { Toolbar } from "@/features/canvas-editor/components/Toolbar";
import { CanvasSurface } from "@/features/canvas-editor/components/CanvasSurface";
import AttributesPanel from "@/features/canvas-editor/components/AttributesPanel";
import ExportControls from "@/features/canvas-editor/components/ExportControls";
import SaveButton from "@/features/canvas-editor/components/SaveButton";
import ShareButton from "@/features/canvas-editor/components/ShareButton";

type CanvasLoadInfo = { title: string; isPublic: boolean; publicSlug: string | null };

const CanvasLoader = ({
                          canvasId,
                          onLoaded,
                      }: {
    canvasId: string;
    onLoaded: (info: CanvasLoadInfo) => void;
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
            onLoaded({
                title: data.title ?? "Untitled canvas",
                isPublic: data.isPublic ?? false,
                publicSlug: data.publicSlug ?? null,
            });
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
    const [authChecked, setAuthChecked] = useState(false);
    const [title, setTitle] = useState("Untitled canvas");
    const [shareState, setShareState] = useState<{ isPublic: boolean; publicSlug: string | null }>({
        isPublic: false,
        publicSlug: null,
    });

    const handleLogout = () => {
        clearToken();
        router.push("/login");
    };

    useEffect(() => {
        if (!getToken()) {
            router.replace("/login");
            return;
        }
        setAuthChecked(true);
    }, [router]);

    const handleLoaded = (info: CanvasLoadInfo) => {
        setTitle(info.title);
        setShareState({ isPublic: info.isPublic, publicSlug: info.publicSlug });
    };

    if (!authChecked) return null;

    return (
        <TooltipProvider>
            <CanvasEngineProvider>
                <CanvasLoader canvasId={id} onLoaded={handleLoaded} />
                <div className="flex h-screen w-full flex-col">
                    <div className="flex items-center justify-between border-b border-panel-border bg-white px-4 py-2">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-md px-2 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                            <ShareButton
                                canvasId={id}
                                initialIsPublic={shareState.isPublic}
                                initialPublicSlug={shareState.publicSlug}
                            />
                            <SaveButton canvasId={id} title={title} />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-md border border-panel-border px-3 py-1.5 text-sm text-zinc-500 hover:border-red-300 hover:text-red-500"
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-1 min-h-0">
                        <div className="flex h-full flex-col items-stretch gap-3 border-r border-panel-border bg-canvas-bg p-3">
                            <div className="flex flex-col divide-y divide-panel-border overflow-hidden rounded-2xl border border-panel-border bg-panel shadow-sm">
                                <ElementPanel />
                                <FreehandPanel />
                                <Toolbar />
                            </div>
                        </div>
                        <CanvasSurface />
                        <div className="flex h-full w-64 flex-col border-l border-panel-border bg-panel">
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