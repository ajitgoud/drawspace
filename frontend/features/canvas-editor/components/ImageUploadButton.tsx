"use client";
import React, { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useCanvasEngineContext } from "../context/CanvasEngineContext";
import { api } from "@/lib/api";

const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 20000;

const ImageUploadButton = () => {
    const { engine } = useCanvasEngineContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "error">("idle");

    const pollUntilReady = async (assetId: string): Promise<string> => {
        const startedAt = Date.now();
        while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
            const asset = await api.getAsset(assetId);
            if (asset.status === "READY") return asset.url;
            if (asset.status === "FAILED") throw new Error("Asset processing failed");
            await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        }
        throw new Error("Timed out waiting for asset to process");
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !engine) return;

        setStatus("uploading");
        try {
            const uploaded = await api.uploadAsset(file);
            // Upload returns immediately; the thumbnail/processing pipeline runs
            // async via Kafka on asset-service, so the URL isn't guaranteed
            // usable yet — poll status rather than firing addImageFromUrl blind.
            setStatus("processing");
            const url = uploaded.status === "READY" ? uploaded.url : await pollUntilReady(uploaded.id);
            await engine.addImageFromUrl(url);
            setStatus("idle");
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <>
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={status === "uploading" || status === "processing"}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-brand disabled:opacity-60"
            >
                {status === "uploading" || status === "processing" ? (
                    <Loader2 size={15} className="animate-spin" />
                ) : (
                    <ImagePlus size={15} />
                )}
                {status === "uploading" ? "Uploading…" : status === "processing" ? "Processing…" : status === "error" ? "Failed" : "Image"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </>
    );
};

export default ImageUploadButton;