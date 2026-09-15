"use client";
import React, { useState } from "react";
import { Save, Check } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { api } from "@/lib/api";

const SaveButton = ({ canvasId, title }: { canvasId: string; title: string }) => {
    const { engine } = useCanvasEngineContext();
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const handleSave = async () => {
        if (!engine) return;
        setStatus("saving");
        try {
            const canvasJson = engine.exportJSON();
            await api.saveCanvas(canvasId, title, canvasJson);
            setStatus("saved");
            setTimeout(() => setStatus("idle"), 1500);
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="flex items-center gap-2 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-hover disabled:opacity-60"
        >
            {status === "saved" ? <Check size={14} /> : <Save size={14} />}
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Failed — retry" : "Save"}
        </button>
    );
};

export default SaveButton;